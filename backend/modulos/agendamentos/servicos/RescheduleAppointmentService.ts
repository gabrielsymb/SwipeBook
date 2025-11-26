import { prisma } from "../../../config/prisma.js";
import { LexicalReorderUtility } from "../../utils/LexicalReorderUtility.js";
import {
  isDataFutura,
  isHorarioConflitante,
  isStatusReagendavel,
} from "../dominio/ValidacoesTempo.js";
import type { RescheduleAppointmentDTO } from "../dtos/RescheduleAppointmentDTO.js";
import {
  appointmentRepository,
  type Agendamento,
} from "../repositorios/AppointmentRepository.js";

export class ConcurrencyError extends Error {
  constructor(message = "Concorrência: versão desatualizada") {
    super(message);
    this.name = "ConcurrencyError";
  }
}

export class RescheduleAppointmentService {
  /**
   * Reagenda um agendamento (UC06) aplicando regras de domínio e persistindo histórico.
   * Fluxo:
   *  - Carrega agendamento e valida prestador
   *  - Valida status atual (apenas scheduled)
   *  - Valida nova data/hora (não pode estar no passado)
   *  - Verifica conflito exato de timestamp no novo dia
   *  - Gera nova position_key conforme ordenação temporal usando fractional indexing
   *  - Atualiza registrando previous_start_at + rescheduled_at e incrementa version
   *  - Registra log de auditoria (REAGENDADO) com before/after
   */
  async execute({
    id,
    novoStartAt,
    prestadorId,
  }: RescheduleAppointmentDTO): Promise<Agendamento> {
    // 1. Buscar agendamento existente
    const agendamento = await appointmentRepository.findById(id);
    if (!agendamento) {
      throw new Error("Agendamento não encontrado");
    }

    // 2. Garantir que o prestador do token/header é o dono do registro
    if (agendamento.prestador_id !== prestadorId) {
      throw new Error("Prestador inválido para este agendamento");
    }

    // 3. Validar se o status permite reagendamento
    if (!isStatusReagendavel(agendamento.status)) {
      throw new Error("Agendamento não está em status reagendável");
    }

    // 4. Validar se a nova data/hora é futura
    if (!isDataFutura(novoStartAt)) {
      throw new Error("Novo horário deve estar no futuro");
    }

    // 5. Carregar agendamentos ativos do dia alvo (ordenados por position_key)
    const diaISO = `${novoStartAt.getUTCFullYear()}-${String(
      novoStartAt.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(novoStartAt.getUTCDate()).padStart(2, "0")}`;
    const agendamentosDoDia: Agendamento[] =
      await appointmentRepository.listByPrestador(prestadorId, diaISO);

    // 6. Verificar conflito de timestamp exato (mesma data_agendada) ignorando o próprio registro
    interface AgendamentoDiaMin {
      id: string;
      data_agendada: Date;
    }
    const diaMinList: Array<AgendamentoDiaMin & { id: string }> =
      agendamentosDoDia.map((a) => ({
        id: a.id,
        data_agendada: a.data_agendada,
      }));
    if (isHorarioConflitante(novoStartAt, diaMinList, id)) {
      throw new Error("Horário já ocupado");
    }

    // 7. Calcular nova chave lexical com base na ordenação temporal
    // Estratégia: ordenar por data_agendada asc, obter vizinhos temporalmente adjacentes.
    const listaSemAtual = agendamentosDoDia
      .filter((a) => a.id !== id)
      .sort((a, b) => a.data_agendada.getTime() - b.data_agendada.getTime());
    let keyBefore: string | null = null;
    let keyAfter: string | null = null;

    // Encontrar posição temporal de inserção
    let insertIndex = 0;
    while (insertIndex < listaSemAtual.length) {
      const current = listaSemAtual[insertIndex];
      if (!current) break; // segurança para noUncheckedIndexedAccess
      if (current.data_agendada.getTime() <= novoStartAt.getTime()) {
        insertIndex++;
        continue;
      }
      break;
    }
    if (insertIndex > 0) {
      const beforeItem = listaSemAtual[insertIndex - 1];
      if (beforeItem) keyBefore = beforeItem.position_key;
    }
    if (insertIndex < listaSemAtual.length) {
      const afterItem = listaSemAtual[insertIndex];
      if (afterItem) keyAfter = afterItem.position_key;
    }
    const novaPositionKey = LexicalReorderUtility.getNewKey(
      keyBefore,
      keyAfter
    );

    // 8. Preparar dados de atualização com histórico
    const agora = new Date();
    const updateData = {
      data_agendada: novoStartAt,
      previous_start_at: agendamento.data_agendada,
      rescheduled_at: agora,
      position_key: novaPositionKey,
    } as const;

    // 9. Atualizar registro. (Nota: poderíamos adicionar verificação de version no WHERE via raw query.)
    let atualizado: Agendamento;
    try {
      atualizado = await appointmentRepository.updateWithVersionControl(
        id,
        agendamento.version,
        updateData
      );
    } catch (e: unknown) {
      if (e instanceof Error && /Concorrência/.test(e.message)) {
        // Mensagem padronizada de concorrência para o controller diferenciar se quiser
        throw new ConcurrencyError(
          "CONCURRENCY_ERROR: versão desatualizada no reagendamento"
        );
      }
      throw e;
    }

    // 10. Registrar auditoria com snapshot mínimo relevante
    await prisma.audit_logs.create({
      data: {
        prestador_id: prestadorId,
        agendamento_id: id,
        entidade: "Agendamento",
        action: "REAGENDADO",
        before: {
          data_agendada: agendamento.data_agendada,
          position_key: agendamento.position_key,
        },
        after: {
          data_agendada: atualizado.data_agendada,
          position_key: atualizado.position_key,
        },
      },
    });

    return atualizado;
  }
}

export const rescheduleAppointmentService = new RescheduleAppointmentService();
