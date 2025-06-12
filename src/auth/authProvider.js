import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [designation, setDesignation] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await axios.get('/check_session');
        console.log('Session check response:', res.data);
        if (res.data.message === 'Valid token') {
          setIsAuthenticated(true);
          setDesignation(res.data.designation || '');
          setUser({ staffId: res.data.staff_id, designation: res.data.designation });
          
        } else {
          setIsAuthenticated(false);
          setDesignation('');
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setDesignation('');
        setUser(null);
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
        setDesignation(res.data.designation || "");
        setUser({ staffId: res.data.staff_id, designation: res.data.designation });
        return { success: true, designation: res.data.designation || "" };
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
    designation,
    user,
  };

  return loading ? (
    <div className="text-center mt-5">Checking session...</div>
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
