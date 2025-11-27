// frontend/src/api/types.ts

// Tipos de Erro Genérico (baseado no formato de erro do nosso backend)
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// ------------------------------------------------------------------
// TIPOS DE AUTENTICAÇÃO
// ------------------------------------------------------------------

// 1. DTO de Requisição de Login (Payload enviado)
export interface LoginRequestDTO {
  email: string;
  password: string;
}

// 2. Resposta de Sucesso da Autenticação (Retorno do /auth/login)
export interface AuthResponse {
  token: string;
  // Dados básicos do prestador para o Front-end
  prestador: {
    id: string;
    nome: string;
  };
}

// ------------------------------------------------------------------
// TIPOS DE AGENDAMENTO (Exemplo, para referência futura)
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// TIPOS DE ENTIDADES RELACIONADAS
// ------------------------------------------------------------------

// 1. Cliente (Simplificado para a Agenda)
export interface Cliente {
  id: string;
  nome: string;
  telefone?: string | null;
  pendencia: boolean; // Flag de alerta de pendência
}

// 2. Servico (Simplificado para a Agenda)
export interface Servico {
  id: string;
  nome: string;
  duracao_min: number; // Duração programada em minutos
}

// ------------------------------------------------------------------
// TIPOS DE AGENDAMENTO
// ------------------------------------------------------------------

export interface Agendamento {
  id: string;
  // Fatos do agendamento
  scheduled_start_at: string; // Data e hora de início programada (ISO string)
  position: string; // Chave Lexorank para a ordem de exibição na lista
  valor_final: number;
  version: number; // Para controle de concorrência
  real_duration_min?: number | null; // Duração real registrada pela sessão (se houver)

  // Status (baseado nas regras de negócio: done, in_progress, pending, canceled, deleted)
  status: "pending" | "in_progress" | "done" | "canceled" | "deleted";
  status_pagamento: "pago" | "pendente";

  // Relações populadas pelo Backend
  cliente: Cliente;
  servico: Servico;
}

// ------------------------------------------------------------------
// TIPOS DE REORDENAÇÃO (REORDER)
// ------------------------------------------------------------------

// DTO de requisição para o PATCH /agendamentos/:id/reorder
export interface ReorderAppointmentRequestDTO {
  // ID do agendamento que agora virá antes do item movido (null se for o primeiro)
  previousAppointmentId: string | null;
  // ID do agendamento que agora virá depois do item movido (null se for o último)
  nextAppointmentId: string | null;
}

// ------------------------------------------------------------------
// TIPOS DE SESSÃO (TIMER / DOCKPLAYER)
// ------------------------------------------------------------------

export type SessionStatus = "active" | "paused" | "stopped" | "finished";

// 1. Entidade Sessao (Retorno de GET /sessions/active ou POST /sessions)
export interface Sessao {
  id: string;
  agendamento_id: string;
  prestador_id: string;

  status: SessionStatus;

  // Tempo total decorrido, em milissegundos (retornado como string, mas será convertido em número)
  elapsed_ms: string;

  // Timestamps (ISO strings)
  started_at: string;
  last_heartbeat_at: string;
  stopped_at: string | null;
}

// 2. DTOs de Requisição
export interface StartSessionRequestDTO {
  agendamentoId: string;
}

export interface HeartbeatRequestDTO {
  // Milissegundos decorridos desde o último Heartbeat (Front-end envia a diferença)
  elapsedMs: number;
}
