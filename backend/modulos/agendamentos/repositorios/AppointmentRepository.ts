import { prisma } from "../../../config/prisma";

// Repositório de acesso a dados de Agendamentos.
// Somente lidar com persistência e consultas; sem regras de negócio.
export class AppointmentRepository {
  // Cria agendamento calculando proximo position_index do dia para o prestador
  async create(data: {
    prestadorId: string;
    clienteId?: string;
    servicoId: string;
    dataAgendada: Date;
    paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
  }) {
    // Busca maior position_index já usado no mesmo dia
    const inicioDia = new Date(
      Date.UTC(
        data.dataAgendada.getUTCFullYear(),
        data.dataAgendada.getUTCMonth(),
        data.dataAgendada.getUTCDate(),
        0,
        0,
        0
      )
    );
    const fimDia = new Date(
      Date.UTC(
        data.dataAgendada.getUTCFullYear(),
        data.dataAgendada.getUTCMonth(),
        data.dataAgendada.getUTCDate(),
        23,
        59,
        59
      )
    );

    const ultimo = await prisma.agendamentos.findFirst({
      where: {
        prestador_id: data.prestadorId,
        data_agendada: { gte: inicioDia, lte: fimDia },
        status: { in: ["scheduled", "in_progress", "done", "canceled"] }, // exclui deleted
      },
      orderBy: { position_index: "desc" },
    });
    const nextPosition = (ultimo?.position_index ?? 0) + 1;

    return prisma.agendamentos.create({
      data: {
        prestador_id: data.prestadorId,
        cliente_id: data.clienteId ?? null,
        servico_id: data.servicoId,
        data_agendada: data.dataAgendada,
        payment_status: data.paymentStatus || "unpaid",
        position_index: nextPosition,
        version: 1,
      },
    });
  }

  async findById(id: string) {
    return prisma.agendamentos.findUnique({ where: { id } });
  }

  async listByPrestador(prestadorId: string, diaISO?: string) {
    // Lista por dia (se fornecido) comparando AAAA-MM-DD
    return prisma.agendamentos.findMany({
      where: {
        prestador_id: prestadorId,
        status: { not: "deleted" },
        ...(diaISO
          ? {
              data_agendada: {
                gte: new Date(diaISO + "T00:00:00Z"),
                lt: new Date(diaISO + "T23:59:59Z"),
              },
            }
          : {}),
      },
      orderBy: [{ data_agendada: "asc" }, { position_index: "asc" }],
    });
  }

  async existsConflict(prestadorId: string, dataAgendada: Date) {
    const conflict = await prisma.agendamentos.findFirst({
      where: {
        prestador_id: prestadorId,
        data_agendada: dataAgendada,
        status: { notIn: ["deleted", "canceled"] },
      },
    });
    return !!conflict;
  }

  async update(
    id: string,
    data: Partial<{
      status: "scheduled" | "in_progress" | "done" | "canceled" | "deleted";
      iniciado_em: Date | null;
      finalizado_em: Date | null;
      canceled_at: Date | null;
      deleted_at: Date | null;
      real_duration_min: number | null;
      previous_start_at: Date | null;
      rescheduled_at: Date | null;
      position_index: number;
      version: number;
    }>
  ) {
    return prisma.agendamentos.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    const now = new Date();
    return prisma.agendamentos.update({
      where: { id },
      data: { status: "deleted", deleted_at: now },
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
