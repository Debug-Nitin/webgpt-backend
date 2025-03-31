import { getChannel } from '../queues/connection.js';
import config from '../config/rabbitmq.js';

/**
 * Get queue information including message count and size
 * @param {string} queueName - Name of the queue to check
 * @returns {Promise<Object>} Queue information
 */
export const getQueueInfo = async (queueName = config.queues.crawl) => {
  try {
    const channel = await getChannel();
    const queueInfo = await channel.assertQueue(queueName, { passive: true });
    
    return {
      name: queueName,
      messageCount: queueInfo.messageCount,
      consumerCount: queueInfo.consumerCount
    };
  } catch (error) {
    console.error(`Error getting queue info for ${queueName}:`, error);
    throw error;
  }
};

/**
 * Purge old messages from a queue if it exceeds a specified count
 * @param {string} queueName - Name of the queue to check
 * @param {number} maxMessages - Maximum allowed messages in the queue
 * @returns {Promise<Object>} Operation statistics
 */
export const trimQueue = async (queueName = config.queues.crawl, maxMessages = 1000) => {
  try {
    const queueInfo = await getQueueInfo(queueName);
    
    // If queue is under the message limit, no need to trim
    if (queueInfo.messageCount <= maxMessages) {
      console.log(`Queue ${queueName} (${queueInfo.messageCount} messages) is under the limit`);
      return { 
        trimmed: false, 
        queueName,
        initialCount: queueInfo.messageCount,
        finalCount: queueInfo.messageCount
      };
    }
    
    console.log(`Queue ${queueName} (${queueInfo.messageCount} messages) exceeds limit, purging...`);
    
    // For RabbitMQ, we can't selectively delete messages easily
    // If the queue is too large, we purge it entirely
    const channel = await getChannel();
    await channel.purgeQueue(queueName);
    
    const updatedQueueInfo = await getQueueInfo(queueName);
    
    return {
      trimmed: true,
      queueName,
      initialCount: queueInfo.messageCount,
      finalCount: updatedQueueInfo.messageCount
    };
  } catch (error) {
    console.error(`Error trimming queue ${queueName}:`, error);
    throw error;
  }
};