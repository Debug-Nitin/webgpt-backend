import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import { swaggerOptions } from '../config/swaggerConfig.js';

export default async function registerDocumentation(app) {
  // Register OpenAPI/Swagger documentation
  await app.register(fastifySwagger, swaggerOptions);

  // Register Scalar API Reference UI
  await app.register(fastifyApiReference, {
    routePrefix: '/api-reference',
    configuration: {
      title: 'WebGPT API Reference',
      description: 'API documentation for the WebGPT service',
      version: '1.0.0',
      theme: {
        colorTheme: 'dark' // or 'light'
      }
    }
  });
  
  console.log('API documentation middleware registered');
}