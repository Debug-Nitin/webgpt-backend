import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDb } from '../config/db.js';
import { getPageByUrl } from '../models/pages.js';
import { queueCrawlTask } from '../queues/producers.js';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use environment variable to specify model or fall back to default
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

// Process query using Gemini API
export async function processWithAI(query, website = null) {
  console.log(`🤖 AI Processing query: "${query}"`);

  try {
    // Check if the webpage is already crawled (moved from controller)
    if (website) {
      const existingPage = await getPageByUrl(website);
      if (!existingPage) {
        // Queue the website for crawling
        await queueCrawlTask(website);
        
        return { 
          error: 'The webpage has not been crawled yet. It has been queued for crawling.',
          queued: true 
        };
      }
    }
    
    // Fetch relevant content from crawled pages
    const pages = await fetchRelevantPages(website);

    if (pages.length === 0) {
      return { error: 'No relevant information available.' };
    }

    // Combine crawled content for AI context
    const content = pages.map((page) => page.extracted_text).join('\n\n');

    // Generate AI prompt
    const prompt = `
    Context:
    ${content}

    Task:
    Answer the user's query accurately based on the above context.
    If relevant information is not available, respond with "I couldn't find relevant information."
    
    Query:
    "${query}"
    `;

    // Get AI response
    const response = await callGeminiAPI(prompt);
    return parseAIResponse(response, pages, query);
  } catch (error) {
    console.error('Error processing with AI:', error);
    
    // Check if it's a model not found error
    if (error.message && error.message.includes('not found')) {
      return { 
        error: 'AI service configuration error. Please contact support.',
        answer: 'Unable to process your query due to a technical issue.',
        source_url: website || '',
        confidence: 0
      };
    }
    
    return { 
      error: 'Error processing the query.',
      answer: 'An error occurred while processing your query.',
      source_url: website || '',
      confidence: 0
    };
  }
}

// Fetch relevant pages from the database
async function fetchRelevantPages(website) {
  const db = getDb();
  let pagesQuery = db('pages').select('url', 'extracted_text');
  if (website) {
    const websiteData = await db('websites').where({ url: website }).first();
    if (websiteData) {
      pagesQuery = pagesQuery.where('website_id', websiteData.website_id);
    }
  }
  return await pagesQuery;
}

// Call Gemini API
async function callGeminiAPI(prompt) {
  try {
    console.log(`Using Gemini model: ${MODEL_NAME}`);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Error processing the query.';
  }
}

// Parse AI response and extract answer
function parseAIResponse(response, pages, query) {
  const match = response.match(/(https?:\/\/[^\s]+)/); // Extract URL if present
  const sourceUrl = match ? match[1] : pages[0]?.url || '';
  const confidence = Math.random().toFixed(2); // Simulate confidence level

  return {
    query,
    answer: response || 'No relevant information found.',
    source_url: sourceUrl,
    confidence,
  };
}
