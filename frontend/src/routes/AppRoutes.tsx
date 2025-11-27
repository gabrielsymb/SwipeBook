import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "../components/shared/AuthLayout";
import { MainLayout } from "../components/shared/MainLayout";
import { AgendaPage } from "../modules/agenda/pages/AgendaPage";
import { ClientsPage } from "../modules/clientes/pages/ClientsPage";
import { ReportsPage } from "../modules/financeiro/pages/ReportsPage";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      <Route element={<ProtectedRoute layout={MainLayout} />}>
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<h1>404: Página não encontrada</h1>} />
    </Routes>
  );
};
