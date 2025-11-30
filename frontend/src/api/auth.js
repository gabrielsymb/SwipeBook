// frontend/src/api/auth.ts
import { api } from "../services/api";
export const authApi = {
    /**
     * @description Envia as credenciais para o endpoint de login.
     * Rota: POST /auth/login
     */
    async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },
    /**
     * Envia dados para registro de novo prestador.
     * Rota: POST /auth/register
     */
    async register(payload) {
        const response = await api.post("/auth/register", payload);
        return response.data;
    },
    // Futuramente, outras funções de Auth como register, forgotPassword, etc.
};
