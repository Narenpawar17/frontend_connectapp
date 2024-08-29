import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  // console.log('authcontext user data initially : ',user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://backendconnectapp.onrender.com/api/user');
        // console.log('API Response:', response.data); // Check the complete response structure
        if (response.data.user) {
          setUser(response.data.user);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (user === null) {
      fetchUser();
    }
  }, [user]);

  const login = (userData) => {
    // Ensure userData includes username and other fields
    // console.log('userdata',userData);
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);