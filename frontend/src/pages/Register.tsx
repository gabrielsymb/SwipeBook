import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { PasswordField } from "../components/ui/PasswordField";
import SwipeBookLogo from "../logo/logo.svg";
import "./Register.css";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
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

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          borderRadius: 2,
        }}
      >
        {/* Logo e Título */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={SwipeBookLogo}
            alt="SwipeBook Logo"
            className="swipebook-logo"
          />
        </Box>

        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#333333",
          }}
        >
          Criar Conta SwipeBook
        </Typography>

        {/* Mensagem de Erro */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {/* Campo de Nome */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome Completo"
            name="nome"
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isLoading}
            variant="outlined"
          />

          {/* Campo de Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            variant="outlined"
          />

          {/* Campo de Senha */}
          <PasswordField
            id="senha"
            name="senha"
            label="Senha"
            value={senha}
            onChange={setSenha}
            disabled={isLoading}
            required
            autoComplete="new-password"
          />

          {/* Campo de Confirmar Senha */}
          <PasswordField
            id="confirmarSenha"
            name="confirmarSenha"
            label="Confirmar Senha"
            value={confirmarSenha}
            onChange={setConfirmarSenha}
            disabled={isLoading}
            required
            autoComplete="new-password"
          />

          {/* Botão de Registro */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || !nome || !email || !senha || !confirmarSenha}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#333333",
              "&:hover": { bgcolor: "#555555" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Criar Conta"
            )}
          </Button>

          {/* Link para Login */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Fazer Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
