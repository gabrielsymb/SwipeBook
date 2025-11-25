import { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO";
import { appointmentRepository } from "../repositorios/AppointmentRepository";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository";
import { auditLogRepository } from "../repositorios/AuditLogRepository";

// Serviço de criação de agendamento.
// Regras principais:
// 1. Status inicial = scheduled
// 2. Não permitir data passada
// 3. Limite de janela futura (14 dias)
// 4. Impedir conflito de horário exato
// 5. Registrar auditoria
export class CreateAppointmentService {
  private readonly MAX_DAYS_AHEAD = 14;

  async execute(prestadorId: string, dto: CreateAppointmentDTO) {
    const dataAgendada = new Date(dto.dataAgendada);
    if (Number.isNaN(dataAgendada.getTime())) {
      throw new Error("Data agendada inválida");
    }

    const now = new Date();
    if (dataAgendada < now) {
      throw new Error("Não é permitido criar em data passada");
    }

    const diffDays =
      (dataAgendada.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > this.MAX_DAYS_AHEAD) {
      throw new Error(`Janela máxima excedida (${this.MAX_DAYS_AHEAD} dias)`);
    }

    const conflict = await appointmentRepository.existsConflict(
      prestadorId,
      dataAgendada
    );
    if (conflict) {
      throw new Error(
        "Conflito de horário: já existe agendamento nesta data/hora"
      );
    }

    // Persistir agendamento
    const created = await appointmentRepository.create({
      prestadorId,
      clienteId: dto.clienteId,
      servicoId: dto.servicoId,
      dataAgendada,
      paymentStatus: dto.paymentStatus,
    });

    // Registrar auditoria
    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: created.id,
      action: "CRIACAO" as AuditActionEnum,
      after: {
        id: created.id,
        status: created.status,
        data_agendada: created.data_agendada,
      },
      metadata: { data_agendada: dto.dataAgendada },
    });

    return created;
  }
}

export const createAppointmentService = new CreateAppointmentService();
