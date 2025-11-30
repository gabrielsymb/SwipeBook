import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Box, Button, CircularProgress, Container, Link, Paper, TextField, Typography, } from "@mui/material";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { PasswordField } from "../components/ui/PasswordField";
import SwipeBookLogo from "../logo/logo.svg";
import "./Register.css";
export const Register = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        // Validações básicas
        if (!nome || !email || !senha || !confirmarSenha) {
            setError("Todos os campos são obrigatórios");
            return;
        }
        if (senha !== confirmarSenha) {
            setError("As senhas não conferem");
            return;
        }
        if (senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }
        // Chama API de registro
        setIsLoading(true);
        authApi
            .register({ nome, email, senha })
            .then(() => {
            setIsLoading(false);
            // Redireciona para login com mensagem opcional
            navigate("/login", { replace: true });
        })
            .catch((err) => {
            setIsLoading(false);
            const msg = err?.response?.data?.error ?? "Erro ao registrar";
            setError(msg);
        });
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
                    }, children: "Criar Conta SwipeBook" }), error && (_jsx(Alert, { severity: "error", sx: { width: "100%", mb: 2 }, children: error })), _jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 1, width: "100%" }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "nome", label: "Nome Completo", name: "nome", autoFocus: true, value: nome, onChange: (e) => setNome(e.target.value), disabled: isLoading, variant: "outlined" }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "email", label: "Email", name: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading, variant: "outlined" }), _jsx(PasswordField, { id: "senha", name: "senha", label: "Senha", value: senha, onChange: setSenha, disabled: isLoading, required: true, autoComplete: "new-password" }), _jsx(PasswordField, { id: "confirmarSenha", name: "confirmarSenha", label: "Confirmar Senha", value: confirmarSenha, onChange: setConfirmarSenha, disabled: isLoading, required: true, autoComplete: "new-password" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", disabled: isLoading || !nome || !email || !senha || !confirmarSenha, sx: {
                                mt: 3,
                                mb: 2,
                                bgcolor: "#333333",
                                "&:hover": { bgcolor: "#555555" },
                            }, children: isLoading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Criar Conta") }), _jsx(Box, { sx: { textAlign: "center", mt: 2 }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["J\u00E1 tem uma conta?", " ", _jsx(Link, { component: RouterLink, to: "/login", underline: "hover", children: "Fazer Login" })] }) })] })] }) }));
};
