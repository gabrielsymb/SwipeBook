// frontend/src/pages/LoginPage/LoginPage.tsx

import React, { useState, FormEvent } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { LogIn } from 'lucide-react';
import { useLogin } from '../../modules/auth/hooks/useLogin'; 

/**
 * @description Página de Login, centralizada, usando a paleta neutra do MUI.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password && !loginMutation.isPending) {
      loginMutation.mutate({ email, senha: password });
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      // Centraliza na tela
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        // Fundo suavemente cinza
        bgcolor: '#f5f5f5' 
      }}
    >
      <Paper 
        elevation={6} // Sombra discreta
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%',
          borderRadius: 2
        }}
      >
        
        {/* Ícone e Título */}
        <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#333333', mb: 2 }}>
            <LogIn size={32} color="white" />
        </Box>
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold', 
            color: '#333333' 
          }}
        >
          SwipeBook | Acesso Prestador
        </Typography>

        {/* Mensagem de Erro (Se houver) */}
        {loginMutation.isError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {loginMutation.error?.error || "Falha ao realizar login. Verifique suas credenciais."}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          
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
            disabled={loginMutation.isPending}
            variant="outlined"
          />

          {/* Campo de Senha */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginMutation.isPending}
            variant="outlined"
          />
          
          {/* Botão de Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loginMutation.isPending || !email || !password}
            sx={{ 
                mt: 3, 
                mb: 2, 
                bgcolor: '#333333', // Cor primária (neutra)
                '&:hover': { bgcolor: '#555555' } 
            }}
          >
            {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
}
