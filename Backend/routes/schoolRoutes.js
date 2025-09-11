const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'schoolImages/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create schoolImages directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('schoolImages')) {
  fs.mkdirSync('schoolImages');
}

// Routes
// Protected routes (require authentication)
router.post('/add', authenticateToken, upload.single('image'), schoolController.addSchool);

// Public routes (anyone can view)
router.get('/all', optionalAuth, schoolController.getAllSchools);
router.get('/:id', optionalAuth, schoolController.getSchoolById);

module.exports = router;
