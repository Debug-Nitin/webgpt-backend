import knex from 'knex';
import knexConfig from '../knexfile.js';

/**
 * Run database migrations
 * @param {string} environment - The environment (development, production, test)
 * @returns {Promise<boolean>} - True if migrations were successful
 */
export const runMigrations = async (environment = process.env.NODE_ENV || 'development') => {
  console.log(`Running migrations for ${environment} environment...`);
  
  try {
    // Initialize knex with the appropriate configuration
    const db = knex(knexConfig[environment]);
    
    // Run migrations
    const [batchNo, log] = await db.migrate.latest();
    
    if (log.length === 0) {
      console.log('✓ Database already up to date');
    } else {
      console.log(`✓ Batch ${batchNo} run: ${log.length} migrations applied`);
      console.log(`   ${log.join('\n   ')}`);
    }
    
    // Optional: Release knex instance if not managing elsewhere
    await db.destroy();
    
    return true;
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    if (error.stack) console.error(error.stack);
    return false;
  }
};

export default { runMigrations };