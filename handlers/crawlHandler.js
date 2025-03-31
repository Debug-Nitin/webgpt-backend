import crawlController from '../controllers/crawlController.js'; 

// Define schema
export const crawlSchema = {
  description: 'Crawl a website and store its content',
  tags: ['webgpt'],
  summary: 'Initiate website crawling process',
  security: [{ authorization: [] }], 
  body: {
    type: 'object',
    required: ['url'],
    properties: {
      url: { 
        type: 'string', 
        format: 'uri',
        description: 'URL of the website to crawl',
      }
    }
  },
  response: {
    202: {
      type: 'object',
      description: 'Successfully queued for crawling',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Website queued for crawling' },
        jobId: { type: 'string', example: 'c7b4e8d2-1234-5678-90ab-cdef01234567' }
      }
    },
    400: {
      type: 'object',
      description: 'Bad request',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Invalid URL format' }
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
    429: {
      type: 'object',
      description: 'Rate limited',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Too many crawl requests' },
        retryAfter: { type: 'integer', example: 60 }
      }
    },
    500: {
      type: 'object',
      description: 'Server error',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Error processing crawl request' }
      }
    }
  }
};

const crawlHandler = async (request, reply) => {
  try {
    const { url } = request.body;
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid URL format'
      });
    }
    
    // Log the user making the request
    console.log(`Crawl request for ${url} initiated by user: ${request.user?.username}`);
    
    const result = await crawlController(request.body, reply);
    return reply.status(200).send(result);
  } catch (error) {
    console.error('Error in crawl handler:', error);
    return reply.status(500).send({
      success: false,
      error: 'Error processing crawl request',
      message: error.message
    });
  }
};

export default crawlHandler;
