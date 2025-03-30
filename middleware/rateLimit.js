import fastifyRateLimit from '@fastify/rate-limit';

export default async function registerRateLimiter(app) {
  await app.register(fastifyRateLimit, {
    max: 100, // Maximum requests allowed per window 
    timeWindow: '1 minute', // Time window for rate limit
    // Different limits for specific routes
    routeConfig: {
      '/api/query': {
        max: 10, // More strict limits for AI queries 
        timeWindow: '1 minute'
      }
    },
    // Customize error response
    errorResponseBuilder: (request, context) => {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${context.after}.`,
        limit: context.max,
        reset: context.ttl // time to wait before retry
      };
    },
  });
  
  console.log('Rate limiting middleware registered');
}