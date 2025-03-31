import { getDb } from '../config/db.js';

// Schema definitions matching migration
export const schema = {
  websites: {
    website_id: { type: 'integer', primaryKey: true, autoIncrement: true },
    url: { type: 'string', unique: true, notNullable: true },
    crawl_status: { type: 'enum', values: ['pending', 'crawling', 'completed', 'error'], default: 'pending' },
    last_crawled: { type: 'timestamp', nullable: true }
  },
  pages: {
    page_id: { type: 'integer', primaryKey: true, autoIncrement: true },
    website_id: { type: 'integer', references: 'websites.website_id', onDelete: 'CASCADE' },
    url: { type: 'string', unique: true, notNullable: true },
    content: { type: 'text', nullable: true },
    extracted_text: { type: 'text', nullable: true }
  }
};

// Get page by URL
export const getPageByUrl = async (url) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    return await db('pages').where({ url }).first();
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

// Update existing page
export const updatePage = async (url, content, extractedText) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    await db('pages')
      .where({ url })
      .update({
        content,
        extracted_text: extractedText,
      });
    
    return true;
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

// Insert a new page
export const insertPage = async (websiteId, url, content, extractedText) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');

    // Extract the integer value from websiteId if it's an object
    const websiteIdValue = typeof websiteId === 'object' && websiteId !== null 
      ? websiteId.website_id 
      : websiteId;
    
    const [pageId] = await db('pages').insert({
      website_id: websiteIdValue,
      url,
      content,
      extracted_text: extractedText,
    }).returning('page_id');
    
    return pageId;
  } catch (error) {
    console.error('Error inserting page:', error);
    throw error;
  }
};

// Get or insert website and return its ID
export const getOrInsertWebsite = async (url) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    // Check if website exists
    const website = await db('websites').where({ url }).first();
    if (website) {
      return website.website_id;
    }
    
    // Insert new website
    const result = await db('websites')
      .insert({ 
        url, 
        crawl_status: 'completed',
        last_crawled: new Date()
      })
      .returning('website_id');
    
    const websiteId = result[0]?.website_id || result[0];
    return websiteId;
  } catch (error) {
    console.error('Error with website record:', error);
    throw error;
  }
};