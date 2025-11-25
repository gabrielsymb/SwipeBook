import prisma from "../config/prisma";

export interface CreateAppointmentDTO {
  prestadorId: string;
  clienteId?: string;
  servicoId: string;
  dataAgendada: Date;
  paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
}

export class AppointmentRepository {
  async create(data: CreateAppointmentDTO) {
    return prisma.agendamentos.create({
      data: {
        prestador_id: data.prestadorId,
        cliente_id: data.clienteId,
        servico_id: data.servicoId,
        data_agendada: data.dataAgendada,
        payment_status: data.paymentStatus || "unpaid",
      },
    });
  }

  async findById(id: string) {
    return prisma.agendamentos.findUnique({ where: { id } });
  }

  async listByPrestador(prestadorId: string, from?: Date, to?: Date) {
    return prisma.agendamentos.findMany({
      where: {
        prestador_id: prestadorId,
        ...(from || to
          ? {
              data_agendada: {
                gte: from,
                lte: to,
              },
            }
          : {}),
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
