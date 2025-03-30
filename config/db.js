import knex from 'knex';
import knexConfig from '../knexfile.js';

// Create a variable to hold the connection
let dbInstance = null;

/**
 * Initialize database connection
 */
export const initializeDatabase = async () => {
  try {
    // Dynamically select the environment
    const environment = process.env.NODE_ENV || 'development';
    
    // Create connection
    dbInstance = knex(knexConfig[environment]);
    
    // Test connection
    await dbInstance.raw('SELECT 1');
    console.log(`✅ PostgreSQL connected using Knex in ${environment} mode`);
    
    return dbInstance;
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
    throw err;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async () => {
  try {
    if (dbInstance) {
      await dbInstance.destroy();
      console.log('🔌 Database connection closed.');
      dbInstance = null;
      return true;
    }
    return false;
  } catch (err) {
    console.error('❌ Error closing database connection:', err.message);
    throw err;
  }
};

// Export the database instance getter
export const getDb = () => dbInstance;

// Default export for convenience
export default { 
  initializeDatabase, 
  closeDatabase, 
  getDb 
};
