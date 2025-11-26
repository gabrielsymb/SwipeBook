import { prisma } from "../../../config/prisma.js";
import type { RevenueQueryDTO } from "../dtos/RevenueQueryDTO.js";

export class GetRevenueService {
  async execute(
    prestadorId: string,
    { startDate, endDate, statusPagamento = "todos" }: RevenueQueryDTO
  ) {
    const startOfDay = new Date(startDate);
    const endOfDay = new Date(endDate);
    // Para incluir o dia final no intervalo, ajustamos para o final do dia
    endOfDay.setDate(endOfDay.getDate() + 1);

    const statusFilter =
      statusPagamento === "todos"
        ? {}
        : {
            status_pagamento: statusPagamento,
          };

    const agendamentos = await prisma.agendamentos.findMany({
      where: {
        prestador_id: prestadorId,
        scheduled_start_at: {
          gte: startOfDay,
          lt: endOfDay,
        },
        ...statusFilter,
        deleted_at: null,
      },
      select: {
        valor_final: true,
        status_pagamento: true,
      },
    });

    let totalFaturado = 0;
    let totalPendente = 0;
    let totalServicos = 0;

    for (const ag of agendamentos) {
      // Converte com segurança `valor_final` para number.
      // Pode ser um Prisma.Decimal com método toNumber(), ou já um number/string.
      let valor = 0;
      if (ag.valor_final != null) {
        const anyVal: any = ag.valor_final;
        if (typeof anyVal.toNumber === "function") {
          valor = anyVal.toNumber();
        } else {
          valor = Number(anyVal) || 0;
        }
      }
      totalServicos++;

      if (ag.status_pagamento === "pago") {
        totalFaturado += valor;
      } else if (ag.status_pagamento === "pendente") {
        totalPendente += valor;
      }
    }

    return {
      periodo: `${startDate} a ${endDate}`,
      totalAgendamentos: totalServicos,
      totalFaturado,
      totalPendente,
      totalPrevisto: totalFaturado + totalPendente,
    };
  }
}

export const getRevenueService = new GetRevenueService();
