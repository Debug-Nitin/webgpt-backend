import { registerUser, loginUser } from '../services/authService.js';
import { getUserByUsername } from '../models/users.js';

// Controller for user registration
export const register = async (data) => {
  try {
    const { username, password } = data;
    
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return { 
        success: false, 
        status: 400,
        error: 'Username already exists' 
      };
    }
    
    // Register the user
    const result = await registerUser(username, password);
    
    return { 
      success: true,
      status: 201,
      message: 'User registered successfully',
      userId: result.userId
    };
  } catch (error) {
    console.error('Error in register controller:', error);
    return { 
      success: false, 
      status: 500,
      error: 'Error registering user' 
    };
  }
};

// Controller for user login
export const login = async (data) => {
  try {
    const { username, password } = data;
    
    // Login the user
    const result = await loginUser(username, password);
    
    if (!result.success) {
      return { 
        success: false,
        status: 401,
        error: result.message 
      };
    }
    
    return {
      success: true,
      status: 200,
      token: result.token,
      user: result.user
    };
  } catch (error) {
    console.error('Error in login controller:', error);
    return { 
      success: false,
      status: 500, 
      error: 'Error logging in' 
    };
  }
};

export default {
  register,
  login
};