const db = require('../config/db');

class SchoolService {
  // Add a new school
  async addSchool(schoolData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO schools (name, address, city, state, contact, image, email_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
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
      
      db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: result.insertId,
            ...schoolData
          });
        }
      });
    });
  }

  // Get all schools
  async getAllSchools() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM schools ORDER BY created_at DESC';
      
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Get school by ID
  async getSchoolById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM schools WHERE id = ?';
      
      db.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  }
}

module.exports = new SchoolService();
