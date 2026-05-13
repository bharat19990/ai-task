import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

/**
 * Admin route guard.
 * Redirects non-admin users to /unauthorized.
 */
const AdminRoute: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
