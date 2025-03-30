import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import { swaggerOptions } from '../config/swaggerConfig.js';

export default async function registerDocumentation(app) {
  // Swagger Configuration
  await app.register(fastifySwagger, swaggerOptions);

  // Register fastifyApiReference
  await app.register(fastifyApiReference, {
    routePrefix: '/api-reference',
    configuration: {
      title: 'API Reference',
      description: 'API reference documentation',
      version: '1.0.0',
    }
  });
  
  console.log('API documentation middleware registered');
}