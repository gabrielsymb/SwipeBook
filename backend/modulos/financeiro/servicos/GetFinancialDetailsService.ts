import { prisma } from "../../../config/prisma.js";
import type { RevenueQueryDTO } from "../dtos/RevenueQueryDTO.js";

export class GetFinancialDetailsService {
  /**
   * @description Retorna a lista de agendamentos dentro de um período com filtros de data, status e busca.
   */
  async execute(
    prestadorId: string,
    { startDate, endDate, statusPagamento = "todos", term }: RevenueQueryDTO
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const whereClause: any = {
      prestador_id: prestadorId,
      scheduled_start_at: {
        gte: start,
        lt: end,
      },
      deleted_at: null,
    };

    if (statusPagamento !== "todos" && statusPagamento) {
      whereClause.status_pagamento = statusPagamento;
    }

    if (term && term.trim().length > 0) {
      whereClause.OR = [
        { cliente: { nome: { contains: term, mode: "insensitive" } } },
        { servico: { nome: { contains: term, mode: "insensitive" } } },
      ];
    }

    return prisma.agendamentos.findMany({
      where: whereClause,
      include: {
        cliente: {
          select: { id: true, nome: true, email: true, telefone: true },
        },
        servico: { select: { id: true, nome: true } },
      },
      orderBy: {
        scheduled_start_at: "asc",
      },
      select: {
        id: true,
        scheduled_start_at: true,
        valor_final: true,
        status_pagamento: true,
        status: true,
        cliente: true,
        servico: true,
      },
    });
  }
}

export const getFinancialDetailsService = new GetFinancialDetailsService();
