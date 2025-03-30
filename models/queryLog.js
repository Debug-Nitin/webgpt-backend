import { getDb } from '../config/db.js';

// Insert query log
export const logQuery = async (query, website_url, answer, source_url, confidence = null) => {
    try {
        const db = getDb();
        if (!db) throw new Error('Database connection not initialized');
        
        return await db('query_logs').insert({
            user_query: query,
            website_url,
            answer,
            source_url,
            confidence,
        });
    } catch (error) {
        console.error('Error logging query:', error);
        throw error;
    }
};

// Fetch query logs
export const getLogs = async () => {
    try {
        const db = getDb();
        if (!db) throw new Error('Database connection not initialized');
        
        return await db('query_logs')
            .select('*')
            .orderBy('timestamp', 'desc');
    } catch (error) {
        console.error('Error fetching query logs:', error);
        throw error;
    }
};
