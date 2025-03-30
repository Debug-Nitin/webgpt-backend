import { getCrawlerStatus } from '../services/statusTracker.js';

// Define the schema
export const statusSchema = {
  description: 'Get the current status of the crawler service',
  tags: ['webgpt'],
  summary: 'Check crawler service status',
  response: {
    200: {
      type: 'object',
      description: 'Successful response with crawler status',
      properties: {
        isActive: { type: 'boolean', description: 'Whether the crawler is currently active', example: false },
        currentUrl: { type: 'string', nullable: true, description: 'URL being crawled (if active)', example: 'https://example.com' },
        startTime: { type: 'string', nullable: true, description: 'When the current crawl started', example: '2023-03-30T19:30:00.000Z' },
        lastCompleted: { type: 'string', nullable: true, description: 'When the last crawl completed', example: '2023-03-30T19:25:00.000Z' },
        completedCount: { type: 'number', description: 'Number of successfully completed crawls', example: 5 },
        failedCount: { type: 'number', description: 'Number of failed crawls', example: 1 },
        uptime: { type: 'number', description: 'Service uptime in seconds', example: 3600 },
        memory: { 
          type: 'object',
          description: 'Memory usage statistics',
          properties: {
            rss: { type: 'number', description: 'Resident Set Size memory usage', example: 75000000 },
            heapTotal: { type: 'number', description: 'Total size of allocated heap', example: 50000000 },
            heapUsed: { type: 'number', description: 'Actual memory used', example: 25000000 },
            external: { type: 'number', description: 'External memory usage', example: 1000000 },
            arrayBuffers: { type: 'number', description: 'Memory used by array buffers', example: 500000 }
          }
        }
      }
    },
    500: {
      type: 'object',
      description: 'Error response',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error retrieving crawler status' },
        error: { type: 'string', example: 'Internal server error' }
      }
    }
  }
};

const statusHandler = async (request, reply) => {
  try {
    const status = getCrawlerStatus();
    return reply.send(status);
  } catch (error) {
    console.error('Error in status handler:', error);
    return reply.status(500).send({
      success: false,
      message: 'Error retrieving crawler status',
      error: error.message
    });
  }
};

export default statusHandler;