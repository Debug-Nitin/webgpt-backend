const queryController = require('../controllers/queryController'); // Import controller
const { Type } = require('@sinclair/typebox')
//Scalar schema

module.exports = async function (fastify, opts) {

  fastify.route({
    method: 'POST',
    url: '/query',
    schema: {
        body: Type.Object({
          query: Type.String(),
          website: Type.Optional(Type.String()),
        }),

        response: {
            200: Type.Object({
                query: Type.String(),
                answer: Type.String(),
                source_url: Type.Optional(Type.String()),

            })

        }

    },

    handler: queryController.handleQuery // Use the controller

  });
};