// components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Protects routes that require user authentication
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Show loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        Loading...
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the component
  return children;
};

export default ProtectedRoute;
