import queryController from '../controllers/queryController.js';

// Define the schema
export const querySchema = {
  description: 'Accepts a query and returns the most relevant answer',
  tags: ['webgpt'],
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
};

const queryHandler = async (request, reply) => {
  // Pass the data to the controller
  return queryController(request.body, reply);
};

export default queryHandler;