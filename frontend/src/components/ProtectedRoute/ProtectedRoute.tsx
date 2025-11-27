// frontend/src/components/ProtectedRoute/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * @description Componente que protege rotas privadas.
 * Se o usuário não estiver autenticado, redireciona para /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redireciona para login preservando a URL que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
