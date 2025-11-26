import { prisma } from "../../../config/prisma.js";
// Tipos literais para ações de auditoria, alinhados ao enum do Prisma
export type AuditActionEnum =
  | "CRIACAO"
  | "ATUALIZACAO"
  | "STATUS_MUDOU"
  | "REPOSICIONADO"
  | "INICIADO"
  | "FINALIZADO"
  | "CANCELADO"
  | "EXCLUIDO"
  | "REAGENDADO";

// Repositório para registrar eventos de auditoria (audit_logs)
// Agora utilizando enum AuditAction e snapshots before/after.
export class AuditLogRepository {
  async register(event: {
    prestadorId: string;
    entidade?: string; // Ex: 'Agendamento' | 'Cliente'
    agendamentoId?: string;
    action: AuditActionEnum; // Enum textual alinhado ao enum Prisma
    before?: any;
    after?: any;
    userActorId?: string;
    metadata?: any;
  }) {
    return prisma.audit_logs.create({
      data: {
        prestador_id: event.prestadorId,
        agendamento_id: event.agendamentoId ?? null,
        entidade: event.entidade ?? null,
        action: event.action,
        before: event.before ? event.before : null,
        after: event.after ? event.after : null,
        user_actor_id: event.userActorId ?? null,
        metadata: event.metadata ?? null,
      },
    });
  }

  // Retorna eventos de auditoria para um agendamento ordenados do mais recente ao mais antigo
  async listByAgendamento(agendamentoId: string) {
    return prisma.audit_logs.findMany({
      where: { agendamento_id: agendamentoId },
      orderBy: { criado_em: "desc" },
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
