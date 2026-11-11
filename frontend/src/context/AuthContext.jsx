import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusflow_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const authData = res.data;
      setUser(authData);
      setToken(authData.token);
      localStorage.setItem('campusflow_token', authData.token);
      localStorage.setItem('campusflow_user', JSON.stringify(authData));
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (data) => {
    setLoading(true);
    try {
      const res = await authService.registerStudent(data);
      const authData = res.data;
      setUser(authData);
      setToken(authData.token);
      localStorage.setItem('campusflow_token', authData.token);
      localStorage.setItem('campusflow_user', JSON.stringify(authData));
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const registerRecruiter = async (data) => {
    setLoading(true);
    try {
      const res = await authService.registerRecruiter(data);
      const authData = res.data;
      setUser(authData);
      setToken(authData.token);
      localStorage.setItem('campusflow_token', authData.token);
      localStorage.setItem('campusflow_user', JSON.stringify(authData));
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusflow_token');
    localStorage.removeItem('campusflow_user');
  };

  const updateUserState = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('campusflow_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        login,
        registerStudent,
        registerRecruiter,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
