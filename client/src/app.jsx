import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import SignupForm from './components/SignupForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
        <Route path="/login" element={<LoginForm />} /> {/* Display login form */}
        <Route path="/signup" element={<SignupForm />} /> {/* Display signup form */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Catch-all redirects to login */}
      </Routes>
    </Router>
  );
};

export default App;
