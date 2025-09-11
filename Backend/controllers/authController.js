const authService = require('../services/authService');

class AuthController {
  // Send OTP to email
  async sendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await authService.sendOTP(email);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in sendOTP controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  }

  // Verify OTP
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      const result = await authService.verifyOTP(email, otp);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in verifyOTP controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to verify OTP'
      });
    }
  }

  // Verify session
  async verifySession(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const result = await authService.verifySession(token);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in verifySession controller:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid session'
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'No token provided'
        });
      }

      const result = await authService.logout(token);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in logout controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to logout'
      });
    }
  }

  // Cleanup expired records
  async cleanup(req, res) {
    try {
      const result = await authService.cleanup();
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in cleanup controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Cleanup failed'
      });
    }
  }
}

module.exports = new AuthController();
