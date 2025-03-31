import { getDb } from '../config/db.js';

/**
 * Get the current size of the database in bytes
 * @param {string} database - Database name
 * @returns {Promise<number>} Database size in bytes
 */
export const getDatabaseSize = async (database = process.env.DB_NAME) => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    // Fix: Use the database parameter correctly in the query
    const result = await db.raw('SELECT pg_database_size(current_database()) as size');
    
    return parseInt(result.rows[0].size);
  } catch (error) {
    console.error('Error getting database size:', error);
    throw error;
  }
};

/**
 * Get the sizes of all tables in the database
 * @returns {Promise<Array>} Array of objects with table_name and size_bytes
 */
export const getTableSizes = async () => {
  try {
    const db = getDb();
    if (!db) throw new Error('Database connection not initialized');
    
    const result = await db.raw(`
      SELECT 
        table_name,
        pg_total_relation_size('"' || table_name || '"') as size_bytes
      FROM 
        information_schema.tables
      WHERE 
        table_schema = 'public'
      ORDER BY 
        size_bytes DESC;
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting table sizes:', error);
    throw error;
  }
};

/**
 * Trim tables to keep database size under limit
 * @param {number} maxSizeBytes - Maximum allowed database size in bytes
 * @returns {Promise<Object>} Statistics about the cleanup operation
 */
export const trimDatabase = async (maxSizeBytes = 2 * 1024 * 1024 * 1024) => { // Default 2GB
  try {
    const dbSize = await getDatabaseSize();
    
    // If database is under the size limit, no need to trim
    if (dbSize < maxSizeBytes) {
      console.log(`Database size (${(dbSize / 1024 / 1024).toFixed(2)} MB) is under the limit`);
      return { 
        trimmed: false, 
        initialSize: dbSize,
        finalSize: dbSize,
        deleted: {} 
      };
    }
    
    console.log(`Database size (${(dbSize / 1024 / 1024).toFixed(2)} MB) exceeds limit, trimming...`);
    
    const db = getDb();
    const stats = { 
      trimmed: true,
      initialSize: dbSize,
      deleted: {} 
    };
    
    // Tables to clean up, in priority order (most disposable first)
    const tablesToTrim = [
      { name: 'query_logs', dateColumn: 'timestamp', retention: '30 days' },
      { name: 'pages', dateColumn: null, keepLatest: 1000 } // keep most recent 1000 pages
    ];
    
    for (const table of tablesToTrim) {
      // Check if table exists before trying to modify it
      const tableExists = await db.schema.hasTable(table.name);
      if (!tableExists) {
        console.log(`Table ${table.name} does not exist, skipping...`);
        continue;
      }
      
      // Get count before deletion for statistics
      const countBefore = await db(table.name).count('* as count').first();
      
      if (table.dateColumn) {
        // Delete old records based on date
        await db(table.name)
          .whereRaw(`${table.dateColumn} < NOW() - INTERVAL '${table.retention}'`)
          .del();
      } else if (table.keepLatest) {
        // Keep only the most recent N records
        const subquery = db(table.name)
          .select('page_id')
          .orderBy('page_id', 'desc')
          .limit(table.keepLatest);
          
        await db(table.name)
          .whereNotIn('page_id', subquery)
          .del();
      }
      
      // Get count after deletion for statistics
      const countAfter = await db(table.name).count('* as count').first();
      stats.deleted[table.name] = parseInt(countBefore.count) - parseInt(countAfter.count);
    }
    
    // Get final database size
    const finalSize = await getDatabaseSize();
    stats.finalSize = finalSize;
    
    console.log(`Database trimmed: ${(stats.initialSize / 1024 / 1024).toFixed(2)} MB → ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('Records deleted:', stats.deleted);
    
    return stats;
  } catch (error) {
    console.error('Error trimming database:', error);
    throw error;
  }
};