import queryController from '../controllers/queryController.js';

async function routes(fastify, options) {
  fastify.post('/query', { schema: {
    description: 'Accepts a query and returns the most relevant answer',
    body: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        website: { type: 'string' },
      },
      required: ['query'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          answer: { type: 'string' },
          source_url: { type: 'string' },
          confidence: { type: 'number' },
        },
      },
    },
  }
 }, queryController);
}

export default routes;
