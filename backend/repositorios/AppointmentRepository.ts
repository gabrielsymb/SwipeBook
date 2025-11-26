import prisma from "../config/prisma.js";

export interface CreateAppointmentDTO {
  prestadorId: string;
  clienteId?: string;
  servicoId: string;
  dataAgendada: Date;
  paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
}

export class AppointmentRepository {
  async create(data: CreateAppointmentDTO) {
    // Calcular proximo position_index do dia para o prestador
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
        status: { in: ["scheduled", "in_progress", "done", "canceled"] },
      },
      orderBy: { position_index: "desc" },
      select: { position_index: true },
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

  async listByPrestador(prestadorId: string, from?: Date, to?: Date) {
    const dateFilter = from && to ? { gte: from, lte: to } : undefined;
    return prisma.agendamentos.findMany({
      where: {
        prestador_id: prestadorId,
        ...(dateFilter ? { data_agendada: dateFilter } : {}),
      },
      orderBy: { data_agendada: "asc" },
    });
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: "unpaid" | "paid" | "partial" | "refunded"
  ) {
    return prisma.agendamentos.update({
      where: { id },
      data: { payment_status: paymentStatus },
    });
  }
}

export default new AppointmentRepository();
