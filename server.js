import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import routes from './routes/routes.js';
import dotenv from 'dotenv';
import { swaggerOptions } from './config/swaggerConfig.js';
import { initializeDatabase, closeDatabase } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = fastify({ logger: true });

// Validate environment variables
if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

// Swagger Configuration
app.register(fastifySwagger, swaggerOptions);

// Register Routes
app.register(routes, { prefix: '/api' });

// Register fastifyApiReference
app.register(fastifyApiReference, {
  routePrefix: '/api-reference',
  configuration: {
    title: 'API Reference',
    description: 'API reference documentation',
    version: '1.0.0',
  }
});

// Error Handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  reply.status(statusCode).send({ error: message });
});

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
    
    // Start the server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();