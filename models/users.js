import { getDb } from '../config/db.js';
import bcrypt from 'bcrypt';

// Schema definition matching migration
export const schema = {
  users: {
    user_id: { type: 'integer', primaryKey: true, autoIncrement: true },
    username: { type: 'string', notNullable: true, unique: true },
    password: { type: 'string', notNullable: true },
    is_admin: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: 'now()' },
    last_login: { type: 'timestamp', nullable: true },
    is_active: { type: 'boolean', default: true }
  }
};

// Create a new user
export const createUser = async (username, password, isAdmin = false) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user
    const [userId] = await db('users').insert({
      username,
      password: hashedPassword,
      is_admin: isAdmin,
      created_at: new Date()
    }).returning('user_id');
    
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    return await db('users').where({ username }).first();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Verify user credentials
export const verifyCredentials = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      return { 
        success: true, 
        user: {
          user_id: user.user_id,
          username: user.username,
          is_admin: user.is_admin
        }
      };
    } else {
      return { success: false, message: 'Invalid password' };
    }
  } catch (error) {
    console.error('Error verifying credentials:', error);
    throw error;
  }
};

// Update user's last login
export const updateLastLogin = async (userId) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    await db('users')
      .where({ user_id: userId })
      .update({ last_login: new Date() });
      
    return true;
  } catch (error) {
    console.error('Error updating last login:', error);
    return false;
  }
};