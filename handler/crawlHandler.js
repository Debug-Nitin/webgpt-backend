import crawlController from '../controllers/crawlController.js';

// Define the schema
export const crawlSchema = {
    description: 'Crawl a website and store its content',
    tags: ['webgpt'],
    body: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
      },
      required: ['url'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          url: { type: 'string' },
          cached: { type: 'boolean' }
        },
      },
    },
  };

const crawlHandler = async (request, reply) => {
    try {
        const { url } = request.body;

        if (!url) {
            return reply.status(400).send({ 
                success: false, 
                error: 'URL is required' 
            });
        }

        // Delegate the processing to the controller
        const result = await crawlController(request.body, reply);
        return reply.status(200).send(result);
    } catch (error) {
        return reply.status(500).send({ 
            success: false, 
            error: 'An unexpected error occurred' 
        });
    }
};

export default crawlHandler;
