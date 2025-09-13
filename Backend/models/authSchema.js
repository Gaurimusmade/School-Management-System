const { Pool } = require('pg');
require('dotenv').config();

// Database connection
let dbConfig;

if (process.env.DATABASE_URL) {
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
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

class AuthModel {
  // Create OTP record
  async createOTP(email, otp, expiresAt) {
    try {
      // First, delete any existing OTP for this email
      await pool.query(
        'DELETE FROM otp_verification WHERE email = $1',
        [email]
      );
      
      // Insert new OTP
      const result = await pool.query(
        'INSERT INTO otp_verification (email, otp, expires_at, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
        [email, otp, expiresAt]
      );
      
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const result = await pool.query(
        'SELECT * FROM otp_verification WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
        [email, otp]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Delete OTP after successful verification
  async deleteOTP(email) {
    try {
      await pool.query(
        'DELETE FROM otp_verification WHERE email = $1',
        [email]
      );
    } catch (error) {
      console.error('Error deleting OTP:', error);
      throw error;
    }
  }

  // Create user session
  async createUserSession(email, token) {
    try {
      // Delete any existing session for this email
      await pool.query(
        'DELETE FROM user_sessions WHERE email = $1',
        [email]
      );
      
      // Insert new session
      const result = await pool.query(
        'INSERT INTO user_sessions (email, token, created_at, expires_at) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'24 hours\') RETURNING id',
        [email, token]
      );
      
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating user session:', error);
      throw error;
    }
  }

  // Verify user session
  async verifyUserSession(token) {
    try {
      const result = await pool.query(
        'SELECT * FROM user_sessions WHERE token = $1 AND expires_at > NOW()',
        [token]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error verifying user session:', error);
      throw error;
    }
  }

  // Delete user session (logout)
  async deleteUserSession(token) {
    try {
      await pool.query(
        'DELETE FROM user_sessions WHERE token = $1',
        [token]
      );
    } catch (error) {
      console.error('Error deleting user session:', error);
      throw error;
    }
  }

  // Clean up expired OTPs and sessions
  async cleanupExpired() {
    try {
      // Delete expired OTPs
      await pool.query(
        'DELETE FROM otp_verification WHERE expires_at < NOW()'
      );
      
      // Delete expired sessions
      await pool.query(
        'DELETE FROM user_sessions WHERE expires_at < NOW()'
      );
    } catch (error) {
      console.error('Error cleaning up expired records:', error);
      throw error;
    }
  }
}

module.exports = new AuthModel();
