import axios, {} from "axios";
// Cria a instância
export const api = axios.create({
    baseURL: "http://localhost:3000", // Ou a URL do seu backend
    timeout: 10000,
});
// INTERCEPTOR DE REQUISIÇÃO
// Antes de sair do front, injeta o token se ele existir no localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("swipebook_token");
    if (token) {
        // garante que headers existe e usa o tipo AxiosRequestHeaders
        config.headers = (config.headers ?? {});
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// INTERCEPTOR DE RESPOSTA
// Se o backend retornar 401 (Token expirado/inválido), desloga o usuário automaticamente
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        // Opcional: Limpar storage e redirecionar para login
        // localStorage.removeItem('swipebook_token');
        // window.location.href = '/login';
        console.warn("Sessão expirada ou inválida");
    }
    return Promise.reject(error);
});
