import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useActiveSessionQuery } from "./modules/session/hooks/useSession";
import { useSessionHeartbeat } from "./modules/session/hooks/useSessionHeartbeat";
import { AppRoutes } from "./routes/Routes";
import { useAuthStore } from "./store/AuthStore";
// Configuração do React Query (Cache e Re-fetch)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});
// Tema personalizado usando paleta neutra
const customTheme = createTheme({
    palette: {
        primary: {
            main: "#333333", // Seu preto/cinza escuro
        },
        secondary: {
            main: "#666666",
        },
        success: {
            main: "#2ecc71", // Verde para status ativo
        },
        warning: {
            main: "#f39c12", // Laranja para status pausado
        },
        error: {
            main: "#e74c3c", // Vermelho para status de erro/stop
        },
        background: {
            default: "#f5f5f5", // Fundo de página suavemente cinza
            paper: "#ffffff", // Fundo de cards/modais branco
        },
    },
    typography: {
        fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
    components: {
    // Configurações globais para botões, etc., se necessário
    },
});
// Componente que executa os hooks globais (deve ser filho dos Providers)
function AppInitializer() {
    const { isAuthenticated, checkAuth } = useAuthStore();
    // Verifica se há token salvo no localStorage na inicialização
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    // Só habilita as queries de sessão SE o usuário estiver autenticado
    useActiveSessionQuery({ enabled: isAuthenticated });
    useSessionHeartbeat({ enabled: isAuthenticated });
    return _jsx(AppRoutes, {});
}
function App() {
    return (
    // 1. React Query Provider
    _jsx(QueryClientProvider, { client: queryClient, children: _jsxs(ThemeProvider, { theme: customTheme, children: [_jsx(CssBaseline, {}), _jsx(BrowserRouter, { children: _jsx(AppInitializer, {}) })] }) }));
}
export default App;
