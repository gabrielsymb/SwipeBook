// Exemplo de uso do sistema de autenticação no App.tsx ou router

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/AuthStore';
import { useEffect } from 'react';

// Seus outros componentes
// import { AgendaPage } from './pages/AgendaPage';
// import { ClientesPage } from './pages/ClientesPage';

function App() {
  const { checkAuth, isLoggedIn } = useAuthStore();

  // Verifica se há token no localStorage ao iniciar a aplicação
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública - Login */}
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/agenda" replace /> : <LoginPage />} 
        />
        
        {/* Rotas protegidas */}
        <Route path="/agenda" element={
          <ProtectedRoute>
            {/* <AgendaPage /> */}
            <div>Agenda Page - Protegida</div>
          </ProtectedRoute>
        } />
        
        <Route path="/clientes" element={
          <ProtectedRoute>
            {/* <ClientesPage /> */}
            <div>Clientes Page - Protegida</div>
          </ProtectedRoute>
        } />
        
        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/agenda" replace />} />
        
        {/* Página 404 ou redirecionamento para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
