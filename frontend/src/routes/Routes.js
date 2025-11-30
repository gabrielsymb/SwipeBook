import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/", element: _jsx(AgendaPage, {}) }), _jsx(Route, { path: "/agenda", element: _jsx(AgendaPage, {}) }), _jsx(Route, { path: "/clientes", element: _jsx(ClientsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }));
}
