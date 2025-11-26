/**
 * @description Verifica se uma data/hora proposta está no futuro (agora ou depois).
 * @param dataHora - A nova data e hora do agendamento.
 * @returns true se a data for futura ou agora, false caso contrário.
 */
export function isDataFutura(dataHora: Date): boolean {
  // A lógica de agendamento não deve permitir horários no passado.
  // Verifica se a dataHora é maior ou igual à data atual.
  const agora = new Date();
  return dataHora.getTime() >= agora.getTime();
}

/**
 * @description Verifica se um agendamento pode ser reagendado.
 * @param statusAtual - O status atual do agendamento.
 * @returns true se o status for 'scheduled' (agendado), false caso contrário.
 */
export function isStatusReagendavel(statusAtual: string): boolean {
  // Só podemos reagendar o que está 'scheduled'. Qualquer outro status bloqueia.
  return statusAtual === "scheduled";
}

// Tipo auxiliar para evitar implicit any em funcoes de dominio
export interface AgendamentoDiaMin {
  id?: string;
  data_agendada: Date;
  position_index?: number;
}

// ================= Funções adicionais de domínio para Reagendamento =================

/** Verifica se duas datas caem no mesmo dia (UTC) */
export function isMesmoDia(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/** Verifica se duas datas possuem exatamente o mesmo instante */
export function isMesmoHorario(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

/**
 * Dado um novo horário e a lista dos agendamentos ativos do dia,
 * verifica se há conflito exato de horário.
 * (Regra simples: não permitir dois agendamentos no mesmo timestamp)
 */
export function isHorarioConflitante(
  novoHorario: Date,
  agendamentosDoDia: Array<AgendamentoDiaMin & { id: string }>,
  ignorarId?: string
): boolean {
  return agendamentosDoDia.some((a: AgendamentoDiaMin & { id: string }) => {
    return (
      a.id !== ignorarId && a.data_agendada.getTime() === novoHorario.getTime()
    );
  });
}

/**
 * Calcula a nova posição (position_index) para um agendamento numa lista ordenada pelo horário.
 * Estratégia: inserir mantendo ordenação crescente por data_agendada.
 */
export function calcularNovaPosicao(
  novoHorario: Date,
  agendamentosDoDia: Array<AgendamentoDiaMin & { position_index: number }>
): number {
  const ordenados = [...agendamentosDoDia].sort(
    (
      a: AgendamentoDiaMin & { position_index: number },
      b: AgendamentoDiaMin & { position_index: number }
    ) => a.data_agendada.getTime() - b.data_agendada.getTime()
  );
  let pos = 1;
  for (const a of ordenados) {
    if (a.data_agendada.getTime() <= novoHorario.getTime()) {
      pos = a.position_index + 1;
    } else {
      break;
    }
  }
  return pos;
}
