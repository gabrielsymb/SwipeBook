import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

export class GetAppointmentHistoryService {
  async execute(agendamentoId: string) {
    return auditLogRepository.listByAgendamento(agendamentoId);
  }
}

export const getAppointmentHistoryService = new GetAppointmentHistoryService();
