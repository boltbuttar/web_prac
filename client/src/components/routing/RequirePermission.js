import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/permissions';

const RequirePermission = ({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(user, permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions);
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequirePermission; 