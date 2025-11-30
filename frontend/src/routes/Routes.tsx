import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { AgendaPage } from "../pages/AgendaPage";
import { ClientsPage } from "../pages/ClientsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Register } from "../pages/Register";

/**
 * @description Define a estrutura de roteamento da aplicação (Públicas e Privadas).
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas Protegidas (Requer Autenticação) */}
      <Route element={<ProtectedRoute />}>
        {/* Rotas Principais */}
        <Route path="/" element={<AgendaPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        {/* Adicione outras rotas privadas aqui (ex: /perfil) */}
      </Route>

      {/* Catch-all para rotas não encontradas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
