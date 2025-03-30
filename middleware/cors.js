import fastifyCors from '@fastify/cors';

export default async function registerCors(app) {
  await app.register(fastifyCors, {
    // Allow requests from any origin
    origin: true,
    // Allow these HTTP methods
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    // Allow these headers in requests
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // Expose these headers in responses
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    // Allow credentials (cookies, authorization headers, etc)
    credentials: true,
    // Cache preflight response for 1 hour
    maxAge: 3600
  });
  
  console.log('CORS middleware registered');
}