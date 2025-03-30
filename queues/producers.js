import { getChannel } from './connection.js';
import config from '../config/rabbitmq.js';

export const queueCrawlTask = async (url) => {
  try {
    const channel = await getChannel();
    const message = {
      url,
      timestamp: new Date().toISOString(),
    };
    
    await channel.publish(
      config.exchanges.crawl,
      config.routingKeys.crawlWebsite,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`✅ Crawl task queued for: ${url}`);
    return true;
  } catch (error) {
    console.error(`Failed to queue crawl task for ${url}:`, error);
    throw error;
  }
};

export default { queueCrawlTask };