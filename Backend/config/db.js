const { Pool } = require('pg');

// Parse DATABASE_URL if present, otherwise use individual parameters
let dbConfig;

if (process.env.DATABASE_URL) {
  // Use the PostgreSQL URL directly
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // Use individual parameters
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_management',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(dbConfig); 

// Test the connection and create table
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    return;
  }
  console.log('Connected to PostgreSQL database');
  
  // Create schools table if it doesn't exist
  const createSchoolsTableQuery = `
    CREATE TABLE IF NOT EXISTS schools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      contact VARCHAR(15) NOT NULL,
      image TEXT,
      email_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create OTP verification table
  const createOTPTableQuery = `
    CREATE TABLE IF NOT EXISTS otp_verification (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create user sessions table
  const createSessionsTableQuery = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
    )
  `;
  
  // Execute table creation queries
  client.query(createSchoolsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating schools table:', err);
    } else {
      console.log('Schools table ready');
    }
  });
  
  client.query(createOTPTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating OTP table:', err);
    } else {
      console.log('OTP table ready');
    }
  });
  
  client.query(createSessionsTableQuery, (err, result) => {
    release(); // Release the client back to the pool
    if (err) {
      console.error('Error creating sessions table:', err);
    } else {
      console.log('Sessions table ready');
    }
  });
});

module.exports = pool;
