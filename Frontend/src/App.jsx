import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AddSchool from './components/AddSchool';
import ShowSchools from './components/ShowSchools';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navbar />
          <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <ShowSchools />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-school" 
                element={
                  <ProtectedRoute>
                    <AddSchool />
                  </ProtectedRoute>
                } 
              />
              <Route path="/show-schools" element={<ShowSchools />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
