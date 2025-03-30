import { logQuery } from '../models/queryLog.js';
import { processWithAI } from '../services/aiProcessor.js';

const queryController = async (data, reply) => {
  try {
    const { query, website } = data;

    // Process the query with AI (will handle website crawling checks)
    const result = await processWithAI(query, website);
    
    // Handle queued crawling response
    if (result.queued) {
      return reply.status(202).send({
        success: false,
        message: result.error,
        queued: true
      });
    }
    
    // Handle other errors
    if (result.error) {
      return reply.status(404).send({
        success: false,
        message: result.error
      });
    }

    // Log the query to the database
    await logQuery(
      query, 
      website || null, 
      result.answer, 
      result.source_url, 
      result.confidence
    );

    // Send response to client
    reply.send({
      query,
      answer: result.answer,
      source_url: result.source_url,
      confidence: parseFloat(result.confidence)
    });
  } catch (error) {
    console.error('Error in query controller:', error);
    reply.status(500).send({
      success: false,
      error: 'An error occurred while processing your query',
      message: error.message
    });
  }
};

export default queryController;