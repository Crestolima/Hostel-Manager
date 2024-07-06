// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
  });

  const login = (token, role) => {
    setAuthState({ isAuthenticated: true, userRole: role });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, userRole: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
