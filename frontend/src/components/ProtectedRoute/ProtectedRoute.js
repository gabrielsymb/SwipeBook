import { jsx as _jsx } from "react/jsx-runtime";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { MainLayout } from "../shared/MainLayout";
/**
 * @description Componente wrapper que protege rotas.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
export function ProtectedRoute() {
    const { isLoggedIn, checkAuth } = useAuthStore();
    // Verifica autenticação ao montar o componente
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    // TODO: Em um sistema real, aqui você verificaria se o estado inicial
    // do AuthStore já foi carregado (ex: do localStorage).
    // Se ainda estiver carregando, você pode mostrar um spinner.
    const isLoadingAuth = false; // Assumindo que o Zustand carrega rápido por agora
    if (isLoadingAuth) {
        return (_jsx(Box, { sx: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }, children: _jsx(CircularProgress, {}) }));
    }
    if (!isLoggedIn) {
        // Se não estiver autenticado, redireciona para a página de login
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Se estiver autenticado, renderiza o conteúdo da rota filha dentro do MainLayout
    return (_jsx(MainLayout, { children: _jsx(Outlet, {}) }));
}
