import { CancelAppointmentDTO } from "../dtos/CancelAppointmentDTO";
import { appointmentRepository } from "../repositorios/AppointmentRepository";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository";
import { auditLogRepository } from "../repositorios/AuditLogRepository";

// Serviço de cancelamento.
// Regras:
// - Permitido cancelar scheduled ou in_progress (decisão de negócio: pode cancelar em andamento)
// - Estados finais (done) não podem cancelar
// - Registra auditoria
export class CancelAppointmentService {
  async execute(prestadorId: string, dto: CancelAppointmentDTO) {
    const ag = await appointmentRepository.findById(dto.agendamentoId);
    if (!ag || ag.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado");
    }

    if (ag.status === "done" || ag.status === "canceled") {
      throw new Error("Agendamento já finalizado ou cancelado");
    }

    const now = new Date();
    const updated = await appointmentRepository.update(ag.id, {
      status: "canceled",
      canceled_at: now,
    });

    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: ag.id,
      action: "CANCELADO" as AuditActionEnum,
      before: { status: ag.status },
      after: { status: updated.status, canceled_at: updated.canceled_at },
      metadata: { canceled_at: now.toISOString(), previous_status: ag.status },
    });

    return updated;
  }
}

export const cancelAppointmentService = new CancelAppointmentService();
