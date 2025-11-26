import { LexicalReorderUtility } from "../../utils/LexicalReorderUtility.js";
import type { ReorderAppointmentDTO } from "../dtos/ReorderAppointmentDTO.js";
import {
  appointmentRepository,
  type Agendamento,
} from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

export class ReorderAppointmentService {
  async execute(dto: ReorderAppointmentDTO): Promise<Agendamento> {
    const agendamento = await appointmentRepository.findById(dto.agendamentoId);
    if (!agendamento || agendamento.prestador_id !== dto.prestadorId) {
      throw new Error("Agendamento não encontrado ou acesso negado.");
    }

    if (["done", "canceled", "deleted"].includes(agendamento.status)) {
      throw new Error("Não é possível reordenar agendamentos inativos.");
    }

    const chaveAtual = agendamento.position_key;
    const novaChave = LexicalReorderUtility.getNewKey(
      dto.keyBefore,
      dto.keyAfter
    );

    if (chaveAtual === novaChave) {
      return agendamento; // Nada a fazer
    }

    let atualizado: Agendamento;
    try {
      atualizado = await appointmentRepository.updateWithVersionControl(
        agendamento.id,
        agendamento.version,
        { position_key: novaChave }
      );
    } catch (e) {
      throw new Error("CONCURRENCY_ERROR: versão desatualizada no reorder");
    }

    await auditLogRepository.register({
      prestadorId: dto.prestadorId,
      entidade: "Agendamento",
      agendamentoId: agendamento.id,
      action: "REPOSICIONADO" as AuditActionEnum,
      before: { position_key: chaveAtual },
      after: { position_key: atualizado.position_key },
      metadata: { chave_anterior: chaveAtual, chave_nova: novaChave },
    });

    return atualizado;
  }
}

export const reorderAppointmentService = new ReorderAppointmentService();
