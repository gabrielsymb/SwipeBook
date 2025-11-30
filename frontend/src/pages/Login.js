import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Box, Button, CircularProgress, Container, Link, Paper, TextField, Typography, } from "@mui/material";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { PasswordField } from "../components/ui/PasswordField";
import SwipeBookLogo from "../logo/logo.svg";
import "./Login.css";
export const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !senha) {
            setError("Email e senha são obrigatórios");
            return;
        }
        // TODO: Implementar lógica de login
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setError("Funcionalidade de login ainda não implementada");
        }, 1000);
    };
    return (_jsx(Container, { component: "main", maxWidth: "xs", sx: {
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
                    }, children: "SwipeBook | Acesso Prestador" }), error && (_jsx(Alert, { severity: "error", sx: { width: "100%", mb: 2 }, children: error })), _jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 1, width: "100%" }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "email", label: "Email ou Usu\u00E1rio", name: "email", autoFocus: true, value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading, variant: "outlined" }), _jsx(PasswordField, { id: "senha", name: "senha", label: "Senha", value: senha, onChange: setSenha, disabled: isLoading, required: true, autoComplete: "current-password" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", disabled: isLoading || !email || !senha, sx: {
                                mt: 3,
                                mb: 2,
                                bgcolor: "#333333",
                                "&:hover": { bgcolor: "#555555" },
                            }, children: isLoading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Entrar") }), _jsx(Box, { sx: { textAlign: "center", mt: 2 }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["N\u00E3o tem uma conta?", " ", _jsx(Link, { component: RouterLink, to: "/register", underline: "hover", children: "Criar Conta" })] }) })] })] }) }));
};
