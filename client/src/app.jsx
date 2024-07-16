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
import { SearchProvider } from './components/SearchContext'; // Ensure this is correctly imported
import UDashboard from './components/list2/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/admin-dashboard/*"
              element={
                <ProtectedRoute requiredRole="admin" element={<AdminDashboard />} />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="add-room" element={<AddRoom />} />
              <Route path="room" element={<Rooms />} />
              <Route path="user" element={<AllUsers />} />
            </Route>
            <Route
              path="/user-dashboard/*"
              element={
                <ProtectedRoute requiredRole="user" element={<UserDashboard />} />
              }
            >
              <Route index element={<UDashboard />} />
              <Route path="dashboard" element={<UDashboard />} />
              <Route path="add-user" element={<AddUser />} />
              
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
