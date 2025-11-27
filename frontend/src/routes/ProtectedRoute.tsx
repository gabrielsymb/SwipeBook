import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

interface ProtectedRouteProps {
  layout: React.ComponentType<{ children: React.ReactNode }>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  layout: Layout,
}) => {
  const { isLoggedIn, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
