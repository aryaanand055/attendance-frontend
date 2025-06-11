import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await axios.get('/check_session');
        if (res.data.message === 'Valid token') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post('/login', credentials);
      if (res.data.message === 'Logged in successfully') {
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, reason: 'unknown' };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return { success: false, reason: 'invalid_credentials' };
      }
      return { success: false, reason: 'network' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return loading ? (
    <div className="text-center mt-5">Checking session...</div>
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
