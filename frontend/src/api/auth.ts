// frontend/src/api/auth.ts

import { api } from "../services/api";
import type { AuthResponse, LoginRequestDTO } from "./types";

export const authApi = {
  /**
   * @description Envia as credenciais para o endpoint de login.
   * Rota: POST /auth/login
   */
  async login(credentials: LoginRequestDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Futuramente, outras funções de Auth como register, forgotPassword, etc.
};
