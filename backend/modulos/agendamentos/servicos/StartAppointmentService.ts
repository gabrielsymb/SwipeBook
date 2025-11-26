import type { StartAppointmentDTO } from "../dtos/StartAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";
import { ConcurrencyError } from "./RescheduleAppointmentService.js";

/**
 * Inicia a execução de um agendamento.
 * Regras:
 *  - Apenas status 'scheduled' pode iniciar.
 *  - Registra timestamp real em iniciado_em.
 *  - Controle otimista de concorrência via version.
 *  - Auditoria obrigatória (INICIADO).
 */
export class StartAppointmentService {
  async execute(prestadorId: string, { agendamentoId }: StartAppointmentDTO) {
    const agendamento = await appointmentRepository.findById(agendamentoId);
    if (!agendamento || agendamento.prestador_id !== prestadorId) {
      throw new Error("Agendamento não encontrado ou acesso negado.");
    }
    if (agendamento.status !== "scheduled") {
      throw new Error(
        `Não é possível iniciar no status atual: ${agendamento.status}.`
      );
    }

    const now = new Date();
    const updatePayload = {
      status: "in_progress" as const,
      iniciado_em: now,
    };

    let atualizado;
    try {
      atualizado = await appointmentRepository.updateWithVersionControl(
        agendamentoId,
        agendamento.version,
        updatePayload
      );
    } catch (e: any) {
      if (e instanceof Error && /Concorrência/.test(e.message)) {
        throw new ConcurrencyError();
      }
      throw e;
    }

    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId,
      action: "INICIADO" as AuditActionEnum,
      before: {
        status: agendamento.status,
        iniciado_em: agendamento.iniciado_em,
      },
      after: { status: atualizado.status, iniciado_em: atualizado.iniciado_em },
      metadata: { iniciado_em: now.toISOString() },
    });

    return atualizado;
  }
}

export const startAppointmentService = new StartAppointmentService();
