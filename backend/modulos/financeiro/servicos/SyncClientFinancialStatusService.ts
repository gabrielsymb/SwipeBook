import { prisma } from "../../../config/prisma.js";

export class SyncClientFinancialStatusService {
  /**
   * @description Verifica se o cliente tem agendamentos pendentes de pagamento e atualiza a flag 'pendencia' dele.
   */
  async execute(clienteId: string): Promise<boolean> {
    const pendingCount = await prisma.agendamentos.count({
      where: {
        cliente_id: clienteId,
        status_pagamento: "pendente",
        status: { in: ["done", "stopped", "canceled"] },
      },
    });

    const newPendenciaStatus = pendingCount > 0;

    await prisma.clientes.update({
      where: { id: clienteId },
      data: {
        pendencia: newPendenciaStatus,
        atualizado_em: new Date(),
      },
    });

    return newPendenciaStatus;
  }
}

export const syncClientFinancialStatusService =
  new SyncClientFinancialStatusService();
