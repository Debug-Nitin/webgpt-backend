const queryController = async (request, reply) => {
  const { query, website } = request.body;

  // Dummy response for now
  reply.send({
    query,
    answer: 'This is a sample answer.',
    source_url: website || 'https://example.com',
    confidence: 0.9,
  });
};

export default queryController;