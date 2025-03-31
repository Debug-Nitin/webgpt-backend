import queryHandler, { querySchema } from '../handlers/queryHandler.js';
import crawlHandler, { crawlSchema } from '../handlers/crawlHandler.js';
import statusHandler, { statusSchema } from '../handlers/statusHandler.js';
import { registerHandler, loginHandler, authSchema } from '../handlers/authHandler.js';
import { authenticate } from '../middleware/auth.js';

async function routes(fastify, options) {
  // Public auth routes
  fastify.post('/auth/register', { 
    schema: authSchema.register 
  }, registerHandler);
  
  fastify.post('/auth/login', { 
    schema: authSchema.login 
  }, loginHandler);
  
  // Protected routes
  fastify.post('/query', { 
    schema: querySchema,
    preHandler: authenticate
  }, queryHandler);
  
  fastify.post('/crawl', { 
    schema: crawlSchema,
    preHandler: authenticate
  }, crawlHandler);
  
  fastify.get('/status', { 
    schema: statusSchema,
    preHandler: authenticate
  }, statusHandler);
  
}

export default routes;