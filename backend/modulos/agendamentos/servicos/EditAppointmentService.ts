import type { EditAppointmentDTO } from "../dtos/EditAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

export class EditAppointmentService {
  // Atualiza campos complementares de um agendamento respeitando controle de versão
  async execute(prestadorId: string, id: string, dto: EditAppointmentDTO) {
    // Verifica existência e pertença
    const existing = await appointmentRepository.findById(id);
    if (!existing || existing.prestador_id !== prestadorId) {
      throw new Error(
        "Agendamento não encontrado ou não pertence ao prestador"
      );
    }

    // Monta dados permitidos
    const data: Partial<Record<string, any>> = {};
    if (dto.servicoId !== undefined) data["servico_id"] = dto.servicoId;
    if (dto.clienteId !== undefined) data["cliente_id"] = dto.clienteId;
    if (dto.paymentStatus !== undefined)
      data["payment_status"] = dto.paymentStatus;

    // Executa update com controle de versão
    const updated = await appointmentRepository.updateWithVersionControl(
      id,
      dto.version,
      data
    );

    // Registrar auditoria mínima
    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: id,
      action: "ATUALIZACAO",
      before: { id, version: dto.version },
      after: { id, version: updated.version },
    });

    return updated;
  }
}

export const editAppointmentService = new EditAppointmentService();
