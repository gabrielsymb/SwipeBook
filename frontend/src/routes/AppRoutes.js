import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AuthLayout, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(AuthLayout, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/register", element: _jsx(AuthLayout, { children: _jsx(Register, {}) }) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { layout: MainLayout }), children: [_jsx(Route, { path: "/agenda", element: _jsx(AgendaPage, {}) }), _jsx(Route, { path: "/clientes", element: _jsx(ClientsPage, {}) }), _jsx(Route, { path: "/relatorios", element: _jsx(ReportsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx("h1", { children: "404: P\u00E1gina n\u00E3o encontrada" }) })] }));
};
