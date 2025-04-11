import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RequirePermission = ({ permission, children }) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequirePermission; 