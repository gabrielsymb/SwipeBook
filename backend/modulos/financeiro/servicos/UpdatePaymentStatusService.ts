import { prisma } from "../../../config/prisma.js";
import { syncClientFinancialStatusService } from "./SyncClientFinancialStatusService.js";
// import { auditLogRepository } from "../../agendamentos/repositorios/AuditLogRepository.js";

export class UpdatePaymentStatusService {
  async execute(
    prestadorId: string,
    agendamentoId: string,
    newStatus: "pago" | "pendente"
  ) {
    const agendamento = await prisma.agendamentos.findUnique({
      where: { id: agendamentoId },
      select: {
        prestador_id: true,
        status_pagamento: true,
        version: true,
        cliente_id: true,
      },
    });

    if (!agendamento || agendamento.prestador_id !== prestadorId) {
      throw new Error(
        "Agendamento não encontrado ou não pertence ao Prestador."
      );
    }

    const updated = await prisma.agendamentos.update({
      where: { id: agendamentoId, version: agendamento.version },
      data: {
        status_pagamento: newStatus,
        version: { increment: 1 },
        atualizado_em: new Date(),
      },
      select: {
        id: true,
        status_pagamento: true,
        version: true,
        cliente_id: true,
      },
    });

    // CHAMA A SINCRONIZAÇÃO DA FLAG DO CLIENTE (não bloqueante)
    // SINCRONIZAR A FLAG DO CLIENTE (aguardamos para garantir consistência)
    if (updated && (updated as any).cliente_id) {
      try {
        await syncClientFinancialStatusService.execute(
          (updated as any).cliente_id
        );
      } catch (err) {
        // log opcional - não rethrow
      }
    }

    // await auditLogRepository.register({ /* ... */ });
    return updated;
  }
}

export const updatePaymentStatusService = new UpdatePaymentStatusService();
