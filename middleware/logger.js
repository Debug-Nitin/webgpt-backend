export default function registerLogger(app) {
  // Configure the built-in logger if needed
  // This is optional, as you've already configured it in server.js with `fastify({ logger: true })`
  app.log.level = process.env.LOG_LEVEL || 'info';
  
  // Add custom request logging for API routes with additional context
  app.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      request.log.info({
        msg: 'API request received',
        ip: request.ip,
        path: request.url,
        method: request.method,
        params: request.params,
        // Don't log sensitive data like passwords, tokens, etc.
        query: request.query
      });
    }
  });
  
  // We can add a custom hook to log specific information on errors
  app.addHook('onError', (request, reply, error, done) => {
    request.log.error({
      msg: 'Request error',
      url: request.url,
      statusCode: reply.statusCode,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    done();
  });
  
  // We don't need a custom onResponse hook as the built-in logger already logs response info
  
  console.log('Logger middleware registered with built-in logger');
}