const fastify = require('fastify')({ logger: true })

//Register routes
const queryRoutes = require('./routes/queryRoutes')
fastify.register(queryRoutes, { prefix: '/api' });

// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})