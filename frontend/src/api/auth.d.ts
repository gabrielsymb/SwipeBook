import type { AuthResponse, LoginRequestDTO } from "./types";
export declare const authApi: {
    /**
     * @description Envia as credenciais para o endpoint de login.
     * Rota: POST /auth/login
     */
    login(credentials: LoginRequestDTO): Promise<AuthResponse>;
    /**
     * Envia dados para registro de novo prestador.
     * Rota: POST /auth/register
     */
    register(payload: {
        nome: string;
        email: string;
        senha: string;
    }): Promise<any>;
};
