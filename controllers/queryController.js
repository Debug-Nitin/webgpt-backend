import { logQuery } from '../models/queryLog.js';

const queryController = async (data, reply) => {
  try {
    const { query, website } = data;

    // Generate answer (placeholder for now)
    const answer = 'This is a sample answer.';
    const source_url = website || 'https://example.com';
    const confidence = 0.9;

    // Log the query to the database
    await logQuery(query, website, answer, source_url, confidence);

    // Send response to client
    reply.send({
      query,
      answer,
      source_url,
      confidence,
    });
  } catch (error) {
    console.error('Error in query controller:', error);
    reply.status(500).send({
      error: 'An error occurred while processing your query',
      message: error.message
    });
  }
};

export default queryController;