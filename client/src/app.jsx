// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import SignupForm from './components/SignupForm';
import AddUser from './list/AddUser';
import AddRoom from './list/AddRoom';
import Dashboard from './list/Dashboard';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Rooms from './list/Rooms';
import AllUsers from './list/AllUsers';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="room" element={<Rooms />} />
            <Route path="user" element={<AllUsers />} />
          </Route>
          
          {/* User Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute element={<UserDashboard />} requiredRole="user" />
            }
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;