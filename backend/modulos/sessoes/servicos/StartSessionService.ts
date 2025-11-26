import { appointmentRepository } from "../../agendamentos/repositorios/AppointmentRepository.js";
import { auditLogRepository } from "../../agendamentos/repositorios/AuditLogRepository.js";
import { sessionRepository } from "../repositorios/SessionRepository.js";

export class StartSessionService {
  async execute(prestadorId: string, agendamentoId: string) {
    // Verifica agendamento
    const ag = await appointmentRepository.findById(agendamentoId);
    if (!ag || ag.prestador_id !== prestadorId) {
      throw new Error(
        "Agendamento não encontrado ou não pertence ao prestador"
      );
    }

    // 1. Verificar se já existe uma sessão ativa (CRÍTICO para o DockPlayer)
    const active = await sessionRepository.findActiveByPrestador(prestadorId);
    if (active) {
      throw new Error(
        `O prestador já possui uma sessão ativa (ID: ${active.id}).`
      );
    }

    // Cria sessão
    const sess = await sessionRepository.create(prestadorId, agendamentoId);

    // Atualiza status do agendamento
    await appointmentRepository.updateWithVersionControl(
      agendamentoId,
      ag.version,
      { status: "in_progress" } as any
    );

    // Auditoria
    await auditLogRepository.register({
      prestadorId,
      entidade: "Sessao",
      agendamentoId,
      action: "INICIADO",
      after: { id: sess.id, status: sess.status },
    });

    return sess;
  }
}

export const startSessionService = new StartSessionService();
