// frontend/src/modules/auth/hooks/useLogin.ts

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/AuthStore';
import { authApi } from '../../../api/auth';
import type { LoginRequestDTO, AuthResponse, ApiErrorResponse } from '../../../api/types';

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<AuthResponse, ApiErrorResponse, LoginRequestDTO>({
    mutationFn: (credentials) => authApi.login(credentials),
    
    onSuccess: (data) => {
      // 1. Salva token e user no store (que também salva no localStorage)
      login(data.token, data.prestador); 
      // 2. Redireciona para a página principal
      navigate('/agenda', { replace: true }); 
    },
    
    onError: (error) => {
      // TODO: Mostrar um toast com a mensagem de erro da API
      console.error('Falha no login:', error);
    },
  });
}
