import type { StartAppointmentDTO } from "../dtos/StartAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

// Serviço de início de atendimento.
// Regras:
// - Status deve estar em scheduled
// - Deve ser do dia atual (simplificação MVP)
// - Registrar timestamp real de início
// - Registrar auditoria
export class StartAppointmentService {
  async execute(prestadorId: string, dto: StartAppointmentDTO) {
    const ag = await appointmentRepository.findById(dto.agendamentoId);
    if (!ag || ag.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado");
    }
    if (ag.status !== "scheduled") {
      throw new Error(
        "Somente agendamentos em status scheduled podem ser iniciados"
      );
    }

    const hoje = new Date();
    const sameDay =
      ag.data_agendada.getUTCFullYear() === hoje.getUTCFullYear() &&
      ag.data_agendada.getUTCMonth() === hoje.getUTCMonth() &&
      ag.data_agendada.getUTCDate() === hoje.getUTCDate();
    if (!sameDay) {
      throw new Error("Somente agendamentos do dia atual podem ser iniciados");
    }

    const now = new Date();
    const before = { status: ag.status, iniciado_em: ag.iniciado_em };
    const updated = await appointmentRepository.updateWithVersionControl(
      ag.id,
      ag.version,
      {
        status: "in_progress",
        iniciado_em: now,
      }
    );

    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: ag.id,
      action: "INICIADO" as AuditActionEnum,
      before,
      after: { status: updated.status, iniciado_em: updated.iniciado_em },
      metadata: { iniciado_em: now.toISOString() },
    });

    return updated;
  }
}

export const startAppointmentService = new StartAppointmentService();
