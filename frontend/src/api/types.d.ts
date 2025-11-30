export interface ApiErrorResponse {
    error: string;
    message?: string;
    statusCode?: number;
}
export interface LoginRequestDTO {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    prestador: {
        id: string;
        nome: string;
    };
}
export interface Cliente {
    id: string;
    nome: string;
    telefone?: string | null;
    pendencia: boolean;
}
export interface Servico {
    id: string;
    nome: string;
    duracao_min: number;
}
export interface Agendamento {
    id: string;
    scheduled_start_at: string;
    position: string;
    valor_final: number;
    version: number;
    real_duration_min?: number | null;
    status: "pending" | "in_progress" | "done" | "canceled" | "deleted";
    status_pagamento: "pago" | "pendente";
    cliente: Cliente;
    servico: Servico;
}
export interface ReorderAppointmentRequestDTO {
    previousAppointmentId: string | null;
    nextAppointmentId: string | null;
}
export type SessionStatus = "active" | "paused" | "stopped" | "finished";
export interface Sessao {
    id: string;
    agendamento_id: string;
    prestador_id: string;
    status: SessionStatus;
    elapsed_ms: string;
    started_at: string;
    last_heartbeat_at: string;
    stopped_at: string | null;
}
export interface StartSessionRequestDTO {
    agendamentoId: string;
}
export interface HeartbeatRequestDTO {
    elapsedMs: number;
}
