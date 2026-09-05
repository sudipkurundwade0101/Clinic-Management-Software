import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
