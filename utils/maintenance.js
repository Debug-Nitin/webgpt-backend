import { initializeDatabase, closeDatabase } from '../config/db.js';
import { connect, disconnect } from '../queues/connection.js';
import { trimDatabase } from './dbMaintainer.js';
import { trimQueue } from './queueMaintainer.js';
import config from '../config/rabbitmq.js';

/**
 * Run all maintenance tasks
 * @param {Object} options - Configuration options for maintenance tasks
 */
export const runMaintenance = async (options = {}) => {
  console.log('🛠️ Starting system maintenance...');
  const startTime = Date.now();
  
  const results = {
    timestamp: new Date().toISOString(),
    database: null,
    queues: {}
  };
  
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Trim database if needed
    results.database = await trimDatabase(options.maxDbSizeBytes || 2 * 1024 * 1024 * 1024);
    
    // Connect to RabbitMQ
    await connect();
    
    // Trim each queue if needed
    for (const queueName of Object.values(config.queues)) {
      results.queues[queueName] = await trimQueue(queueName, options.maxQueueMessages || 1000);
    }
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Maintenance completed in ${elapsedTime}s`);
    
    return results;
  } catch (error) {
    console.error('❌ Error during maintenance:', error);
    throw error;
  } finally {
    // Always clean up connections
    try {
      await disconnect();
      await closeDatabase();
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  }
};

// Allow direct execution via command line
if (process.argv[1].endsWith('maintenance.js')) {
  import('dotenv/config').then(async () => {
    try {
      await runMaintenance();
      process.exit(0);
    } catch (error) {
      console.error('Maintenance failed:', error);
      process.exit(1);
    }
  });
}

export default { runMaintenance };