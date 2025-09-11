const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const authModel = require('../models/authSchema');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiry = '24h';
  }

  // Generate JWT token
  generateToken(email) {
    return jwt.sign({ email }, this.jwtSecret, { expiresIn: this.jwtExpiry });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  // Send OTP to email
  async sendOTP(email) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Generate OTP
      const otp = emailService.generateOTP();
      
      // Set expiry time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // Save OTP to database
      await authModel.createOTP(email, otp, expiresAt);
      
      // Send OTP via email
      await emailService.sendOTPEmail(email, otp);
      
      return {
        success: true,
        message: 'OTP sent successfully to your email',
        expiresIn: 10 * 60 // 10 minutes in seconds
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  // Verify OTP and create session
  async verifyOTP(email, otp) {
    try {
      // Verify OTP from database
      const otpRecord = await authModel.verifyOTP(email, otp);
      
      if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
      }

      // Generate JWT token
      const token = this.generateToken(email);
      
      // Create user session
      await authModel.createUserSession(email, token);
      
      // Delete used OTP
      await authModel.deleteOTP(email);
      
      return {
        success: true,
        message: 'OTP verified successfully',
        token,
        user: { email }
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
  }

  // Verify user session
  async verifySession(token) {
    try {
      // Verify JWT token
      const decoded = this.verifyToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Check session in database
      const session = await authModel.verifyUserSession(token);
      if (!session) {
        throw new Error('Session expired or invalid');
      }

      return {
        success: true,
        user: { email: decoded.email }
      };
    } catch (error) {
      console.error('Error verifying session:', error);
      throw new Error(error.message || 'Invalid session');
    }
  }

  // Logout user
  async logout(token) {
    try {
      await authModel.deleteUserSession(token);
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Error logging out:', error);
      throw new Error('Failed to logout');
    }
  }

  // Clean up expired records
  async cleanup() {
    try {
      await authModel.cleanupExpired();
      return {
        success: true,
        message: 'Cleanup completed'
      };
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw new Error('Cleanup failed');
    }
  }
}

module.exports = new AuthService();
