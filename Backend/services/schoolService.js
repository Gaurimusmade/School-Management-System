const db = require('../config/db');

class SchoolService {
  // Add a new school
  async addSchool(schoolData) {
    try {
      const query = `
        INSERT INTO schools (name, address, city, state, contact, image, email_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        schoolData.name,
        schoolData.address,
        schoolData.city,
        schoolData.state,
        schoolData.contact,
        schoolData.image,
        schoolData.email_id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Get all schools
  async getAllSchools() {
    try {
      const query = 'SELECT * FROM schools ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Get school by ID
  async getSchoolById(id) {
    try {
      const query = 'SELECT * FROM schools WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new SchoolService();
