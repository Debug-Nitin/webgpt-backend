export const swaggerOptions = {
  routePrefix: '/docs',
  openapi: {
    info: {
      title: 'WebGPT API',
      description: `
      API to query and retrieve answers from crawled websites using AI.

      ## Authentication
      To use protected endpoints, you need to:
      1. Register a user account via POST /api/auth/register
      2. Login via POST /api/auth/login to get a JWT token
      3. Include the token in all subsequent requests as a Bearer token:
        \`\`\`
        Authorization: Bearer your_token_here
        \`\`\`
      `,
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'webgpt', description: 'Web and AI query-related endpoints' },
      { name: 'auth', description: 'Authentication endpoints' },
    ],
    components: {
      securitySchemes: {
        authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme'
        }
      }
    }
  },
  exposeRoute: true,
};
