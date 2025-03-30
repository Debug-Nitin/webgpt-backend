import fastify from 'fastify';
import routes from './routes/routes.js';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './config/db.js';

// Import middleware
import registerRateLimiter from './middleware/rateLimit.js';
import registerLogger from './middleware/logger.js';
import registerDocumentation from './middleware/documentation.js';
import registerErrorHandler from './middleware/errorHandler.js';
import registerCors from './middleware/cors.js'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = fastify({ logger: true });

// Validate environment variables
if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

// Register middleware
registerLogger(app);
registerErrorHandler(app);

// Register async middleware
const setupServer = async () => {
  // Register CORS middleware first (important!)
  await registerCors(app); // Add this line
  
  // Register middleware that returns promises
  await registerRateLimiter(app);
  await registerDocumentation(app);

  // Register routes
  app.register(routes, { prefix: '/api' });
};

// Graceful Shutdown
const shutdown = async () => {
  try {
    console.log('Shutting down server...');
    await closeDatabase();
    await app.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start Server
const start = async () => {
  try {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize database connection
    await initializeDatabase();
    
    // Setup middleware and routes
    await setupServer();
    
    // Start the server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();