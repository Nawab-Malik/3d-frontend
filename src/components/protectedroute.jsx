// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const token = localStorage.getItem('userToken');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to={requireAdmin ? "/admin" : "/"} replace />;
  }

  // If admin access is required, check if user is admin
  if (requireAdmin && userData.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;