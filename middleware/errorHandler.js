export default function registerErrorHandler(app) {
  // Error Handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    reply.status(statusCode).send({ 
      error: message,
      success: false,
      statusCode
    });
  });
  
  console.log('Error handler middleware registered');
}