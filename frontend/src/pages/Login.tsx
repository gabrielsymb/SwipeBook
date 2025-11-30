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
import { Link as RouterLink } from "react-router-dom";
import { PasswordField } from "../components/ui/PasswordField";
import SwipeBookLogo from "../logo/logo.svg";
import "./Login.css";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
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
          SwipeBook | Acesso Prestador
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
          {/* Campo de Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email ou Usuário"
            name="email"
            autoFocus
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
            autoComplete="current-password"
          />

          {/* Botão de Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || !email || !senha}
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
              "Entrar"
            )}
          </Button>

          {/* Link para Register */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Criar Conta
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
