import type { CancelAppointmentDTO } from "../dtos/CancelAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

/**
 * Serviço responsável por cancelar um agendamento.
 * Regras principais:
 * - Permitido cancelar quando status ∈ {"scheduled", "in_progress"}.
 * - Não é permitido cancelar quando status ∈ {"done", "canceled"} ou qualquer outro não listado.
 * - Usa controle de concorrência otimista via version no update.
 * - Registra auditoria com before/after e metadados relevantes.
 */
export class CancelAppointmentService {
  /**
   * Executa o cancelamento de um agendamento.
   * @param prestadorId ID do prestador autenticado (autorização por owner do agendamento)
   * @param dto Objeto com o agendamentoId a ser cancelado
   * @returns Agendamento atualizado após o cancelamento
   * @throws Error se não encontrar/agendamento não pertencer ao prestador ou se status não permitir cancelamento
   */
  async execute(prestadorId: string, { agendamentoId }: CancelAppointmentDTO) {
    const ag = await appointmentRepository.findById(agendamentoId);

    if (!ag || ag.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado ou acesso negado.");
    }

    const allowed = ["scheduled", "in_progress"] as const;
    if (!allowed.includes(ag.status as (typeof allowed)[number])) {
      throw new Error(`Status não cancelável: ${ag.status}`);
    }

    const now = new Date();
    const updated = await appointmentRepository.updateWithVersionControl(
      ag.id,
      ag.version,
      { status: "canceled", canceled_at: now }
    );

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
