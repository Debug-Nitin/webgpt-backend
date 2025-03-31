import queryController from '../controllers/queryController.js';

// Define schema
export const querySchema = {
  description: 'Query content from crawled websites using AI',
  tags: ['webgpt'],
  summary: 'Get AI-generated answers based on crawled website content',
  security: [{ authorization: [] }], 
  body: {
    type: 'object',
    required: ['query'],
    properties: {
      query: { 
        type: 'string', 
        description: 'The question or query to answer',
      },
      website: { 
        type: 'string', 
        format: 'uri',
        description: 'Optional specific website URL to query against',
      }
    }
  },
  response: {
    200: {
      type: 'object',
      description: 'Successful response with AI-generated answer',
      properties: {
        query: { type: 'string', example: 'What are the main features of this product?' },
        answer: { type: 'string', example: 'The main features of this product include...' },
        source_url: { type: 'string', example: 'https://example.com/features' },
        confidence: { type: 'number', example: 0.85 }
      }
    },
    202: {
      type: 'object',
      description: 'Website not yet crawled, crawling has been queued',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'The webpage has not been crawled yet. It has been queued for crawling.' },
        queued: { type: 'boolean', example: true }
      }
    },
    400: {
      type: 'object',
      description: 'Bad request',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Query is required' }
      }
    },
    401: {
      type: 'object',
      description: 'Authentication error',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Authorization header missing or invalid' }
      }
    },
    403: {
      type: 'object',
      description: 'Forbidden',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Access denied' }
      }
    },
    404: {
      type: 'object',
      description: 'Not found',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'No relevant information available.' }
      }
    },
    429: {
      type: 'object',
      description: 'Rate limited',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Query rate limit exceeded' },
        retryAfter: { type: 'integer', example: 60 }
      }
    },
    500: {
      type: 'object',
      description: 'Server error',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'An error occurred while processing your query' }
      }
    }
  }
};

const queryHandler = async (request, reply) => {
  try {
    const { query } = request.body;
    if (!query || query.trim() === '') {
      return reply.status(400).send({
        success: false,
        error: 'Query is required'
      });
    }
    
    // Log the user making the request
    console.log(`Query "${query.substring(0, 30)}..." by user: ${request.user?.username}`);
    
    // Pass the request to the controller
    return queryController(request.body, reply);
  } catch (error) {
    console.error('Error in query handler:', error);
    return reply.status(500).send({
      success: false,
      error: 'An error occurred while processing your query',
      message: error.message
    });
  }
};

export default queryHandler;