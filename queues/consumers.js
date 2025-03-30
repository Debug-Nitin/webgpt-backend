import { getChannel } from './connection.js';
import config from '../config/rabbitmq.js';
import { crawlWebsite } from '../services/crawler.js';
import { getPageByUrl, updatePage, insertPage, getOrInsertWebsite } from '../models/pages.js';

export const startCrawlConsumer = async () => {
  const channel = await getChannel();
  
  console.log('Starting crawl consumer...');
  
  await channel.consume(config.queues.crawl, async (msg) => {
    if (!msg) return;
    
    try {
      const content = JSON.parse(msg.content.toString());
      const { url } = content;
      
      console.log(`🔄 Processing crawl task for: ${url}`);
      
      // Check if page exists
      const existingPage = await getPageByUrl(url);
      
      // Perform the actual crawling
      const crawlResult = await crawlWebsite(url);
      
      if (crawlResult.success) {
        // Get or create website record
        const websiteId = await getOrInsertWebsite(url);
        
        // Update or insert page content
        if (existingPage) {
          await updatePage(url, crawlResult.content, crawlResult.extractedText);
          console.log(`✅ Updated page content for: ${url}`);
        } else {
          await insertPage(websiteId, url, crawlResult.content, crawlResult.extractedText);
          console.log(`✅ Inserted new page: ${url}`);
        }
        
        // Acknowledge the message
        channel.ack(msg);
      } else {
        console.error(`❌ Failed to crawl: ${url}`);
        // Reject the message and requeue it
        channel.nack(msg, false, true);
      }
    } catch (error) {
      console.error('Error processing crawl task:', error);
      // Dead letter the message after multiple failures
      channel.nack(msg, false, false);
    }
  });
  
  console.log('✅ Crawl consumer started successfully');
};

export default { startCrawlConsumer };