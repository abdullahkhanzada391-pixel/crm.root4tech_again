import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/crm';
import { getRoleDefaultRoute } from '@/utils/roleConfig';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user account is inactive, deny access and force logout to login page
  if (user.status === 'Inactive') {
    return <Navigate to="/login" replace />;
  }

  // Admins always have unrestricted access to all routes and portal previews
  if (user.role === 'admin') {
    return children ? <>{children}</> : <Outlet />;
  }

  // If specific roles are required, enforce strict RBAC permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role);

    if (!hasRole) {
      // Prevent URL tampering: redirect user strictly to their own role's dashboard
      const authorizedHome = user.defaultRoute || getRoleDefaultRoute(user.role);
      return <Navigate to={authorizedHome} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
