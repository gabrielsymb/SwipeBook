import type { FinishAppointmentDTO } from "../dtos/FinishAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

// Serviço de conclusão de atendimento.
// Regras:
// - Status atual deve ser in_progress
// - Calcula duração real se iniciado_em presente
// - Registra auditoria
export class FinishAppointmentService {
  async execute(prestadorId: string, dto: FinishAppointmentDTO) {
    const ag = await appointmentRepository.findById(dto.agendamentoId);
    if (!ag || ag.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado");
    }
    if (ag.status !== "in_progress") {
      throw new Error("Somente agendamentos em andamento podem ser concluídos");
    }
    if (!ag.iniciado_em) {
      throw new Error("Timestamp de início ausente");
    }

    const now = new Date();
    const realDurationMin = Math.max(
      0,
      Math.round((now.getTime() - ag.iniciado_em.getTime()) / 60000)
    );

    const updated = await appointmentRepository.updateWithVersionControl(
      ag.id,
      ag.version,
      {
        status: "done",
        finalizado_em: now,
        real_duration_min: realDurationMin,
      }
    );

    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: ag.id,
      action: "FINALIZADO" as AuditActionEnum,
      before: { status: ag.status, iniciado_em: ag.iniciado_em },
      after: {
        status: updated.status,
        finalizado_em: updated.finalizado_em,
        real_duration_min: realDurationMin,
      },
      metadata: { finalizado_em: now.toISOString(), realDurationMin },
    });

    return updated;
  }
}

export const finishAppointmentService = new FinishAppointmentService();
