import { verifyToken } from '../services/authService.js';

// Authenticate requests using JWT
export const authenticate = async (request, reply) => {
  try {
    console.log('Authenticating request...');
    console.log('Request headers:', request.headers);
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ 
        success: false, 
        error: 'Authorization header missing or invalid' 
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const result = verifyToken(token);
    
    if (!result.success) {
      return reply.status(401).send({ 
        success: false, 
        error: result.message 
      });
    }
    
    // Add user object to request for use in handlers
    request.user = result.user;
  } catch (err) {
    return reply.status(500).send({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

export default { authenticate };