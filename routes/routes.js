import queryHandler, { querySchema } from '../handler/queryHandler.js';
import crawlHandler, { crawlSchema } from '../handler/crawlHandler.js';

async function routes(fastify, options) {
  // Query endpoint
  fastify.post('/query', { schema: querySchema }, queryHandler);
  
  // Crawl endpoint
  fastify.post('/crawl', { schema: crawlSchema }, crawlHandler);
}

export default routes;