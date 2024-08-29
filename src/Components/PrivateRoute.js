import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  
  // Check if the token is present in localStorage
  const token = localStorage.getItem('token');
  
  return token && user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
