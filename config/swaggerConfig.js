export const swaggerOptions = {
    routePrefix: '/docs',
    openapi: {
      info: {
        title: 'WebGPT API',
        description: 'API to query and retrieve answers from crawled websites.',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'query', description: 'Query related endpoints' },
      ],
    },
    exposeRoute: true,
  };