import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
  });

  // Load auth state from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setAuthState({ isAuthenticated: true, userRole: role });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setAuthState({ isAuthenticated: true, userRole: role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAuthState({ isAuthenticated: false, userRole: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};