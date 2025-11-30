import type { HeartbeatRequestDTO, Sessao, StartSessionRequestDTO } from "./types";
export declare const sessionApi: {
    /**
     * @description Busca a sessão ativa do prestador (usado ao carregar o app).
     * Rota: GET /sessions/active
     */
    fetchActiveSession(): Promise<Sessao | null>;
    /**
     * @description Inicia uma nova sessão para um agendamento.
     * Rota: POST /sessions
     */
    startSession(data: StartSessionRequestDTO): Promise<Sessao>;
    /**
     * @description Envia o delta de tempo decorrido para atualizar o contador no Backend.
     * Rota: PATCH /sessions/:id/heartbeat
     */
    sendHeartbeat(sessionId: string, data: HeartbeatRequestDTO): Promise<Sessao>;
    /**
     * @description Pausa a sessão.
     * Rota: PATCH /sessions/:id/pause
     */
    pauseSession(sessionId: string): Promise<Sessao>;
    /**
     * @description Retoma a sessão (ativa).
     * Rota: PATCH /sessions/:id/resume
     */
    resumeSession(sessionId: string): Promise<Sessao>;
    /**
     * @description Finaliza a sessão (e marca agendamento como 'done').
     * Rota: POST /sessions/:id/stop
     */
    stopSession(sessionId: string): Promise<Sessao>;
};
