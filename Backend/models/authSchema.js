const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

class AuthModel {
  // Create OTP record
  async createOTP(email, otp, expiresAt) {
    try {
      const connection = await pool.getConnection();
      
      // First, delete any existing OTP for this email
      await connection.execute(
        'DELETE FROM otp_verification WHERE email = ?',
        [email]
      );
      
      // Insert new OTP
      const [result] = await connection.execute(
        'INSERT INTO otp_verification (email, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())',
        [email, otp, expiresAt]
      );
      
      connection.release();
      return result.insertId;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM otp_verification WHERE email = ? AND otp = ? AND expires_at > NOW()',
        [email, otp]
      );
      
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Delete OTP after successful verification
  async deleteOTP(email) {
    try {
      const connection = await pool.getConnection();
      
      await connection.execute(
        'DELETE FROM otp_verification WHERE email = ?',
        [email]
      );
      
      connection.release();
    } catch (error) {
      console.error('Error deleting OTP:', error);
      throw error;
    }
  }

  // Create user session
  async createUserSession(email, token) {
    try {
      const connection = await pool.getConnection();
      
      // Delete any existing session for this email
      await connection.execute(
        'DELETE FROM user_sessions WHERE email = ?',
        [email]
      );
      
      // Insert new session
      const [result] = await connection.execute(
        'INSERT INTO user_sessions (email, token, created_at, expires_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))',
        [email, token]
      );
      
      connection.release();
      return result.insertId;
    } catch (error) {
      console.error('Error creating user session:', error);
      throw error;
    }
  }

  // Verify user session
  async verifyUserSession(token) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM user_sessions WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error verifying user session:', error);
      throw error;
    }
  }

  // Delete user session (logout)
  async deleteUserSession(token) {
    try {
      const connection = await pool.getConnection();
      
      await connection.execute(
        'DELETE FROM user_sessions WHERE token = ?',
        [token]
      );
      
      connection.release();
    } catch (error) {
      console.error('Error deleting user session:', error);
      throw error;
    }
  }

  // Clean up expired OTPs and sessions
  async cleanupExpired() {
    try {
      const connection = await pool.getConnection();
      
      // Delete expired OTPs
      await connection.execute(
        'DELETE FROM otp_verification WHERE expires_at < NOW()'
      );
      
      // Delete expired sessions
      await connection.execute(
        'DELETE FROM user_sessions WHERE expires_at < NOW()'
      );
      
      connection.release();
    } catch (error) {
      console.error('Error cleaning up expired records:', error);
      throw error;
    }
  }
}

module.exports = new AuthModel();
