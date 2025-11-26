import { prisma } from "../../../config/prisma.js";
import {
  calcularNovaPosicao,
  isDataFutura,
  isHorarioConflitante,
  isMesmoDia,
  isStatusReagendavel,
  type AgendamentoDiaMin,
} from "../dominio/ValidacoesTempo.js";
import type { RescheduleAppointmentDTO } from "../dtos/RescheduleAppointmentDTO.js";
import {
  appointmentRepository,
  type Agendamento,
} from "../repositorios/AppointmentRepository.js";

export class RescheduleAppointmentService {
  /**
   * Reagenda um agendamento (UC06) aplicando regras de domínio e persistindo histórico.
   * Fluxo:
   *  - Carrega agendamento e valida prestador
   *  - Valida status atual (apenas scheduled)
   *  - Valida nova data/hora (não pode estar no passado)
   *  - Verifica conflito exato de timestamp no novo dia
   *  - Recalcula position_index conforme ordenação temporal
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

    // 5. Carregar todos os agendamentos ativos do dia alvo (para cálculo de posição e conflitos)
    const diaISO = `${novoStartAt.getUTCFullYear()}-${String(
      novoStartAt.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(novoStartAt.getUTCDate()).padStart(2, "0")}`;
    const agendamentosDoDia: Agendamento[] =
      await appointmentRepository.listByPrestador(prestadorId, diaISO);

    // 6. Verificar conflito de timestamp exato (mesma data_agendada) ignorando o próprio registro
    if (
      isHorarioConflitante(
        novoStartAt,
        agendamentosDoDia.map(
          (a: Agendamento): AgendamentoDiaMin & { id: string } => ({
            id: a.id,
            data_agendada: a.data_agendada,
          })
        ),
        id
      )
    ) {
      throw new Error("Horário já ocupado");
    }

    // 7. Calcular nova posição na fila daquele dia
    //    Estratégia: ordenar temporariamente e inserir após todos <= novo horário.
    let novaPosicao: number;
    const mudouDia = !isMesmoDia(agendamento.data_agendada, novoStartAt);
    if (mudouDia) {
      // Mudou de dia: utiliza todos agendamentos daquele dia
      novaPosicao = calcularNovaPosicao(
        novoStartAt,
        agendamentosDoDia.map(
          (a: Agendamento): AgendamentoDiaMin & { position_index: number } => ({
            data_agendada: a.data_agendada,
            position_index: a.position_index,
          })
        )
      );
    } else {
      // Mesmo dia: remove o próprio da lista para não interferir no cálculo
      novaPosicao = calcularNovaPosicao(
        novoStartAt,
        agendamentosDoDia
          .filter((a: Agendamento): boolean => a.id !== id)
          .map(
            (
              a: Agendamento
            ): AgendamentoDiaMin & { position_index: number } => ({
              data_agendada: a.data_agendada,
              position_index: a.position_index,
            })
          )
      );
    }

    // 8. Preparar dados de atualização com histórico
    const agora = new Date();
    const updateData = {
      data_agendada: novoStartAt,
      previous_start_at: agendamento.data_agendada,
      rescheduled_at: agora,
      position_index: novaPosicao,
      version: agendamento.version + 1, // Incremento para controle otimista
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
        throw new Error(
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
          position_index: agendamento.position_index,
        },
        after: {
          data_agendada: atualizado.data_agendada,
          position_index: atualizado.position_index,
        },
      },
    });

    return atualizado;
  }
}

export const rescheduleAppointmentService = new RescheduleAppointmentService();
