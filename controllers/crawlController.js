import { queueCrawlTask } from '../queues/producers.js';
import { getPageByUrl } from '../models/pages.js';

export const handleCrawlRequest = async (data, reply) => {
  const { url } = data;
  
  if (!url) {
    return reply.status(400).send({ 
      success: false, 
      message: 'URL is required' 
    });
  }
  
  try {
    // Check if the page has been crawled before
    const existingPage = await getPageByUrl(url);
    
    if (existingPage) {
      console.log('🔄 Page already exists in database');
      
      // Optional: Check if we need to recrawl based on last_crawled timestamp
      const lastCrawled = new Date(existingPage.last_crawled);
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      
      if (Date.now() - lastCrawled < oneDay) {
        console.log('🕒 Page was crawled recently. Using cached data.');
        return reply.send({
          success: true,
          message: 'Using cached page data',
          url,
          cached: true
        });
      }
    }
    
    // Queue the crawl task
    await queueCrawlTask(url);
    
    return reply.send({
      success: true,
      message: 'Crawl task queued successfully',
      url,
      queued: true
    });
  } catch (error) {
    console.error('Error in crawl controller:', error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export default handleCrawlRequest;