import queryHandler, { querySchema } from '../handler/queryHandler.js';
import crawlHandler, { crawlSchema } from '../handler/crawlHandler.js';
import statusHandler, { statusSchema } from '../handler/statusHandler.js';

async function routes(fastify, options) {
  // Query endpoint
  fastify.post('/query', { schema: querySchema }, queryHandler);
  
  // Crawl endpoint
  fastify.post('/crawl', { schema: crawlSchema }, crawlHandler);
  
  // Status endpoint - GET request for easy checking
  fastify.get('/status', { schema: statusSchema }, statusHandler);
}

export default routes;