import 'dotenv/config';

// Helper function to determine SSL configuration
const getSslConfig = () => {
  // Check if SSL is explicitly enabled/disabled
  if (process.env.DB_SSL === 'true') {
    return process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' 
      ? { rejectUnauthorized: false } 
      : true;
  } else if (process.env.DB_SSL === 'false') {
    return false;
  }
  
  // Default behavior based on environment
  return process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false }
    : false;
};

export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'webgpt',
      ssl: getSslConfig()
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: getSslConfig()
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'nitin1234',
      database: `${process.env.DB_NAME}_test` || 'webgpt_test',
      ssl: getSslConfig()
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/test',
    },
  }
};
