import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

export interface DeleteAppointmentDTO {
  agendamentoId: string;
}

export class DeleteAppointmentService {
  /**
   * Exclui logicamente um agendamento (UC05). Permitido se status ∈ scheduled|canceled|done.
   */
  async execute(prestadorId: string, { agendamentoId }: DeleteAppointmentDTO) {
    const agendamento = await appointmentRepository.findById(agendamentoId);
    if (!agendamento || agendamento.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado ou acesso negado.");
    }
    if (!["scheduled", "canceled", "done"].includes(agendamento.status)) {
      throw new Error(`Status não deletável: ${agendamento.status}`);
    }
    if (agendamento.status === "deleted") {
      return agendamento; // já deletado
    }
    const payload = { status: "deleted" as const, deleted_at: new Date() };
    const atualizado = await appointmentRepository.updateWithVersionControl(
      agendamento.id,
      agendamento.version,
      payload
    );
    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId,
      action: "EXCLUIDO" as AuditActionEnum,
      before: { status: agendamento.status },
      after: { status: atualizado.status, deleted_at: atualizado.deleted_at },
      metadata: { deleted_at: atualizado.deleted_at?.toISOString() },
    });
    return atualizado;
  }
}
export const deleteAppointmentService = new DeleteAppointmentService();
