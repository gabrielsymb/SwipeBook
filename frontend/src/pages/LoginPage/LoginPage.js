import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// frontend/src/pages/LoginPage/LoginPage.tsx
import { Alert, Box, Button, CircularProgress, Container, Link, Paper, TextField, Typography, } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import SwipeBookLogo from "../../logo/logo.svg";
import { useLogin } from "../../modules/auth/hooks/useLogin";
import "./LoginPage.css";
/**
 * @description Página de Login, centralizada, usando a paleta neutra do MUI.
 */
export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginMutation = useLogin();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password && !loginMutation.isPending) {
            loginMutation.mutate({ email, password });
        }
    };
    return (_jsx(Container, { component: "main", maxWidth: "xs", 
        // Centraliza na tela
        sx: {
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Fundo suavemente cinza
            bgcolor: "#f5f5f5",
        }, children: _jsxs(Paper, { elevation: 6, sx: {
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                borderRadius: 2,
            }, children: [_jsx(Box, { sx: {
                        mb: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }, children: _jsx("img", { src: SwipeBookLogo, alt: "SwipeBook Logo", className: "swipebook-logo" }) }), _jsx(Typography, { component: "h1", variant: "h5", sx: {
                        mb: 3,
                        fontWeight: "bold",
                        color: "#333333",
                    }, children: "SwipeBook | Acesso Prestador" }), loginMutation.isError && (_jsx(Alert, { severity: "error", sx: { width: "100%", mb: 2 }, children: loginMutation.error?.error ||
                        "Falha ao realizar login. Verifique suas credenciais." })), _jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 1, width: "100%" }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "email", label: "Email ou Usu\u00E1rio", name: "email", autoFocus: true, value: email, onChange: (e) => setEmail(e.target.value), disabled: loginMutation.isPending, variant: "outlined" }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Senha", type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), disabled: loginMutation.isPending, variant: "outlined" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", disabled: loginMutation.isPending || !email || !password, sx: {
                                mt: 3,
                                mb: 2,
                                bgcolor: "#333333", // Cor primária (neutra)
                                "&:hover": { bgcolor: "#555555" },
                            }, children: loginMutation.isPending ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Entrar") }), _jsx(Box, { sx: { textAlign: "center", mt: 2 }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["N\u00E3o tem uma conta?", " ", _jsx(Link, { component: RouterLink, to: "/register", underline: "hover", children: "Criar Conta" })] }) })] })] }) }));
}
