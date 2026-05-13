import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage';
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage';
import NotFoundPage from '../features/auth/pages/NotFoundPage';

// Post Pages
import Dashboard from '../features/posts/pages/Dashboard';
import CreatePostPage from '../features/posts/pages/CreatePostPage';
import MyPostsPage from '../features/posts/pages/MyPostsPage';
import AdminDashboard from '../features/posts/pages/AdminDashboard';
import ManagePostsPage from '../features/posts/pages/ManagePostsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/my-posts" element={<MyPostsPage />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<ManagePostsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Common Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
