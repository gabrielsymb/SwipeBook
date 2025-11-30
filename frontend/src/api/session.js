// frontend/src/api/session.ts
import { api } from "../services/api";
export const sessionApi = {
    /**
     * @description Busca a sessão ativa do prestador (usado ao carregar o app).
     * Rota: GET /sessions/active
     */
    async fetchActiveSession() {
        try {
            // O backend pode retornar 200 com a sessão ou 204 No Content se não houver ativa
            const response = await api.get("/sessions/active");
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 204) {
                return null; // Nenhuma sessão ativa
            }
            throw error;
        }
    },
    /**
     * @description Inicia uma nova sessão para um agendamento.
     * Rota: POST /sessions
     */
    async startSession(data) {
        const response = await api.post("/sessions", data);
        return response.data;
    },
    /**
     * @description Envia o delta de tempo decorrido para atualizar o contador no Backend.
     * Rota: PATCH /sessions/:id/heartbeat
     */
    async sendHeartbeat(sessionId, data) {
        const response = await api.patch(`/sessions/${sessionId}/heartbeat`, data);
        return response.data;
    },
    /**
     * @description Pausa a sessão.
     * Rota: PATCH /sessions/:id/pause
     */
    async pauseSession(sessionId) {
        const response = await api.patch(`/sessions/${sessionId}/pause`);
        return response.data;
    },
    /**
     * @description Retoma a sessão (ativa).
     * Rota: PATCH /sessions/:id/resume
     */
    async resumeSession(sessionId) {
        const response = await api.patch(`/sessions/${sessionId}/resume`);
        return response.data;
    },
    /**
     * @description Finaliza a sessão (e marca agendamento como 'done').
     * Rota: POST /sessions/:id/stop
     */
    async stopSession(sessionId) {
        // Usamos POST aqui, pois é uma ação destrutiva que altera o agendamento
        const response = await api.post(`/sessions/${sessionId}/stop`);
        return response.data;
    },
};
