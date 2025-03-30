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
    400: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
    202: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        queued: { type: 'boolean' },
      },
    },
  },
};

const queryHandler = async (request, reply) => {
  const { query } = request.body;
  
  // Basic validation (Fastify will actually handle this based on the schema,
  // but it's good to have as a safety check)
  if (!query || query.trim() === '') {
    return reply.status(400).send({
      success: false,
      message: 'Query is required',
    });
  }
  
  // Pass the validated data to the controller
  return queryController(request.body, reply);
};

export default queryHandler;