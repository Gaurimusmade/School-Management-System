# School Management System

A complete school management system with MySQL backend and React frontend, featuring school registration and display functionality.

## Features

- **Add School**: Form to register new schools with validation
- **View Schools**: Display all schools in an ecommerce-style grid layout
- **Image Upload**: Store school images in a dedicated folder
- **Responsive Design**: Works on both mobile and desktop devices
- **Form Validation**: Client-side validation using react-hook-form

## Tech Stack

### Backend
- Node.js with Express
- MySQL database
- Multer for file uploads
- CORS enabled

### Frontend
- React with Vite
- React Router for navigation
- React Hook Form for form handling
- Tailwind CSS for styling
- Axios for API calls

## Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT,
  email_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL server
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   # Copy .env.example and update with your MySQL credentials
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   ```

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE school_management;
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## API Endpoints

### Schools API

- **POST** `/api/schools/add` - Add a new school
- **GET** `/api/schools/all` - Get all schools

### Request Format for Adding School

```json
{
  "name": "School Name",
  "address": "Complete Address",
  "city": "City Name",
  "state": "State Name",
  "contact": "Contact Number",
  "email_id": "email@example.com",
  "image": "image_file"
}
```

## Project Structure

```
School_Management/
├── Backend/
│   ├── config/
│   │   └── db.js              # MySQL database configuration
│   ├── controllers/
│   │   └── schoolController.js # School API controllers
│   ├── services/
│   │   └── schoolService.js   # Business logic for schools
│   ├── routes/
│   │   └── schoolRoutes.js    # API routes
│   ├── schoolImages/          # Uploaded school images
│   ├── index.js               # Main server file
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddSchool.jsx  # Add school form component
    │   │   ├── ShowSchools.jsx # Display schools component
    │   │   └── Navbar.jsx      # Navigation component
    │   ├── App.jsx             # Main app with routing
    │   └── main.jsx            # Entry point
    └── package.json
```

## Usage

1. **Add a School:**
   - Navigate to the "Add School" page
   - Fill in all required fields
   - Upload a school image
   - Submit the form

2. **View Schools:**
   - Navigate to the "View Schools" page
   - See all registered schools in a grid layout
   - Each card shows school name, address, city, and image

Thank You !