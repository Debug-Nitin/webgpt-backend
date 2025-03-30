import dotenv from 'dotenv';
import { connect } from './queues/connection.js';
import { startCrawlConsumer } from './queues/consumers.js';
import { initializeDatabase } from './config/db.js';

dotenv.config();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Worker shutting down...');
  process.exit(0);
});

// Start worker
const startWorker = async () => {
  try {
    console.log('Starting worker...');
    
    // Initialize database connection
    await initializeDatabase();
    
    // Connect to RabbitMQ
    await connect();
    
    // Start consumers
    await startCrawlConsumer();
    
    console.log('✅ Worker started successfully');
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();