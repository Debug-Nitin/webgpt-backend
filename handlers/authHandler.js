import { register, login } from '../controllers/authController.js';

// Define schemas
export const authSchema = {
  register: {
    description: 'Register a new user',
    tags: ['auth'],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['username', 'password']
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' }
        }
      },
      400: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' }
        }
      }
    }
  },
  login: {
    description: 'Login to get access token',
    tags: ['auth'],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['username', 'password']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              username: { type: 'string' },
              isAdmin: { type: 'boolean' }
            }
          }
        }
      },
      401: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' }
        }
      }
    }
  }
};

// Register handler
export const registerHandler = async (request, reply) => {
  try {
    const { username, password } = request.body;
    
    // Use the controller for registration
    const result = await register({ username, password });
    
    // Return response based on controller result
    return reply.status(result.status).send({
      success: result.success,
      message: result.message,
      error: result.error
    });
  } catch (error) {
    console.error('Error in register handler:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Error registering user' 
    });
  }
};

// Login handler
export const loginHandler = async (request, reply) => {
  try {
    const { username, password } = request.body;
    
    // Use the controller for login
    const result = await login({ username, password });
    
    // Return response based on controller result
    return reply.status(result.status).send({
      success: result.success,
      token: result.token,
      user: result.user,
      error: result.error
    });
  } catch (error) {
    console.error('Error in login handler:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Error logging in' 
    });
  }
};

export default {
  registerHandler,
  loginHandler,
  authSchema
};