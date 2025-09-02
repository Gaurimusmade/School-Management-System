const schoolService = require('../services/schoolService');

class SchoolController {
  // Add a new school
  async addSchool(req, res) {
    try {
      const schoolData = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        contact: req.body.contact,
        image: req.file ? req.file.filename : null,
        email_id: req.body.email_id
      };

      const newSchool = await schoolService.addSchool(schoolData);
      
      res.status(201).json({
        success: true,
        message: 'School added successfully',
        data: newSchool
      });
    } catch (error) {
      console.error('Error adding school:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding school',
        error: error.message
      });
    }
  }

  // Get all schools
  async getAllSchools(req, res) {
    try {
      const schools = await schoolService.getAllSchools();
      
      res.status(200).json({
        success: true,
        data: schools
      });
    } catch (error) {
      console.error('Error getting schools:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting schools',
        error: error.message
      });
    }
  }

  // Get school by ID
  async getSchoolById(req, res) {
    try {
      const { id } = req.params;
      const school = await schoolService.getSchoolById(id);
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: school
      });
    } catch (error) {
      console.error('Error getting school:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting school',
        error: error.message
      });
    }
  }
}

module.exports = new SchoolController();
