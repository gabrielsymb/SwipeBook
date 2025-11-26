import { appointmentRepository } from "../../agendamentos/repositorios/AppointmentRepository.js";
import { auditLogRepository } from "../../agendamentos/repositorios/AuditLogRepository.js";
import { sessionRepository } from "../repositorios/SessionRepository.js";

export class StopSessionService {
  async execute(sessionId: string) {
    const sess = await sessionRepository.findById(sessionId);
    if (!sess) throw new Error("Sessão não encontrada");

    // Para sessão e atualiza agendamento
    const stopped = await sessionRepository.stop(sessionId);

    // Atualiza agendamento para done e grava real_duration
    const realDurationMs = Number(stopped.elapsed_ms ?? 0);
    await appointmentRepository.updateWithVersionControl(
      sess.agendamento_id,
      (await appointmentRepository.findById(sess.agendamento_id))!.version,
      {
        status: "done",
        real_duration_min: Math.round(realDurationMs / 60000),
      } as any
    );

    await auditLogRepository.register({
      prestadorId: sess.prestador_id,
      entidade: "Sessao",
      agendamentoId: sess.agendamento_id,
      action: "FINALIZADO",
      after: {
        id: sessionId,
        status: "stopped",
        elapsed_ms: stopped.elapsed_ms,
      },
    });

    return stopped;
  }
}

export const stopSessionService = new StopSessionService();
