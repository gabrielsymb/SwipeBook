import { prisma } from "../../../config/prisma.js";

// Alias de tipo derivado do client (evita import direto que não existe)
export type Agendamento = NonNullable<
  Awaited<ReturnType<typeof prisma.agendamentos.findUnique>>
>;

// Definição do Repositório (versão Lexical)
export class AppointmentRepository {
  // ############## UTILS PARA DATAS ##############
  private getDayRange(data: Date) {
    // Cria o range do dia (00:00:00Z até 23:59:59Z) para consultas precisas no Postgres.
    const inicioDia = new Date(
      Date.UTC(
        data.getUTCFullYear(),
        data.getUTCMonth(),
        data.getUTCDate(),
        0,
        0,
        0
      )
    );
    const fimDia = new Date(
      Date.UTC(
        data.getUTCFullYear(),
        data.getUTCMonth(),
        data.getUTCDate(),
        23,
        59,
        59
      )
    );
    return { gte: inicioDia, lte: fimDia };
  }

  // ############## MÉTODOS DE CONSULTA ##############

  // Busca o Agendamento pelo ID
  async findById(id: string): Promise<Agendamento | null> {
    return prisma.agendamentos.findUnique({ where: { id } });
  }

  // Retorna a chave lexical do último agendamento do dia (para inserção no fim)
  async getLastPositionKeyForDay(
    prestadorId: string,
    data: Date
  ): Promise<string | null> {
    const range = this.getDayRange(data);
    const ultimo = await prisma.agendamentos.findFirst({
      where: {
        prestador_id: prestadorId,
        data_agendada: range,
        status: { not: "deleted" },
      },
      orderBy: { position_key: "desc" },
      select: { position_key: true },
    });
    return ultimo?.position_key ?? null;
  }

  // Verifica se há conflito de horário para a dataAgendada (ignora cancelados/deletados)
  async existsConflict(
    prestadorId: string,
    dataAgendada: Date
  ): Promise<boolean> {
    // Comentário: A lógica de conflito deve ser mais robusta, checando a duração do serviço (UC futuro).
    // Por enquanto, checa se existe qualquer agendamento não-finalizado no mesmo horário/dia.
    const conflict = await prisma.agendamentos.findFirst({
      where: {
        prestador_id: prestadorId,
        data_agendada: dataAgendada,
        status: { notIn: ["deleted", "canceled", "done"] }, // Não deve conflitar com Done
      },
    });
    return !!conflict;
  }

  // ############## MÉTODOS DE PERSISTÊNCIA ##############

  // Cria um novo agendamento com position_key já calculada externamente
  async create(data: {
    prestadorId: string;
    clienteId?: string;
    servicoId: string;
    dataAgendada: Date;
    paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
    positionKey: string; // chave lexical calculada antes (service)
  }): Promise<Agendamento> {
    return prisma.agendamentos.create({
      data: {
        prestador_id: data.prestadorId,
        cliente_id: data.clienteId ?? null,
        servico_id: data.servicoId,
        data_agendada: data.dataAgendada,
        payment_status: data.paymentStatus ?? "unpaid",
        position_key: data.positionKey,
        version: 1,
      },
    });
  }

  // MÉTODO CORRIGIDO E ESSENCIAL PARA REAGENDAMENTO E REORDER
  async updateWithVersionControl(
    id: string,
    currentVersion: number,
    data: Partial<
      Omit<Agendamento, "id" | "version" | "criado_em" | "atualizado_em">
    >
  ): Promise<Agendamento> {
    // Executa update com checagem de versão usando updateMany para saber quantas linhas foram afetadas.
    const agora = new Date();
    const result = await prisma.agendamentos.updateMany({
      where: { id, version: currentVersion },
      data: {
        ...data,
        atualizado_em: agora,
        version: currentVersion + 1,
      },
    });
    if (result.count === 0) {
      throw new Error("Concorrência detectada: versão desatualizada");
    }
    // Retorna registro atualizado
    const atualizado = await prisma.agendamentos.findUnique({ where: { id } });
    if (!atualizado) throw new Error("Agendamento não encontrado após update");
    return atualizado;
  }

  // ############## MÉTODOS DE TRANSIÇÃO (Simplificados) ##############

  // Método de bulk update removido (não necessário com Fractional Indexing)

  // Soft Delete (Mantido o padrão anterior)
  async softDelete(id: string) {
    const now = new Date();
    return prisma.agendamentos.update({
      where: { id },
      data: { status: "deleted", deleted_at: now },
    });
  }

  // Lista todos os agendamentos não deletados de um prestador em um dia específico
  async listByPrestador(
    prestadorId: string,
    diaISO: string
  ): Promise<Agendamento[]> {
    // Lista todos os agendamentos não deletados de um dia específico em ordem.
    return prisma.agendamentos.findMany({
      where: {
        prestador_id: prestadorId,
        status: { not: "deleted" },
        data_agendada: {
          gte: new Date(diaISO + "T00:00:00Z"),
          lt: new Date(diaISO + "T23:59:59Z"),
        },
      },
      orderBy: [{ data_agendada: "asc" }, { position_key: "asc" }],
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
