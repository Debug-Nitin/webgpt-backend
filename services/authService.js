import jwt from 'jsonwebtoken';
import { createUser, verifyCredentials, updateLastLogin } from '../models/users.js';

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id, 
      username: user.username,
      isAdmin: user.is_admin 
    },
    process.env.JWT_SECRET || 'fallback_secret_key_for_development',
    { expiresIn: '24h' }
  );
};

// Register a new user
export const registerUser = async (username, password) => {
  try {
    // Create user (all users are non-admin by default)
    const userId = await createUser(username, password, false);
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (username, password) => {
  try {
    // Verify credentials
    const result = await verifyCredentials(username, password);
    
    if (!result.success) {
      return { success: false, message: result.message };
    }
    
    // Update last login timestamp
    await updateLastLogin(result.user.user_id);
    
    // Generate token
    const token = generateToken(result.user);
    
    return { 
      success: true, 
      token,
      user: {
        id: result.user.user_id,
        username: result.user.username,
        isAdmin: result.user.is_admin
      }
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    if (!token) return { success: false, message: 'No token provided' };
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    return { success: true, user: decoded };
  } catch (error) {
    return { 
      success: false, 
      message: error.name === 'TokenExpiredError' 
        ? 'Token expired' 
        : 'Invalid token' 
    };
  }
};