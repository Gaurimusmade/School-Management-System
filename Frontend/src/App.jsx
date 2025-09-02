import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddSchool from './components/AddSchool';
import ShowSchools from './components/ShowSchools';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Routes>
            <Route path="/" element={<AddSchool />} />
            <Route path="/add-school" element={<AddSchool />} />
            <Route path="/show-schools" element={<ShowSchools />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
