import type { Request, Response } from "express";
import type { RevenueQueryDTO } from "../dtos/RevenueQueryDTO.js";
import { getFinancialDetailsService } from "../servicos/GetFinancialDetailsService.js";
import { getRevenueService } from "../servicos/GetRevenueService.js";
import { updatePaymentStatusService } from "../servicos/UpdatePaymentStatusService.js";

export class ReportController {
  async getRevenue(req: Request, res: Response) {
    try {
      const prestadorId = (req as any).prestadorId!;
      const { startDate, endDate, statusPagamento } =
        req.query as unknown as RevenueQueryDTO;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate e endDate são obrigatórios." });
      }

      const result = await getRevenueService.execute(prestadorId, {
        startDate,
        endDate,
        statusPagamento,
      });

      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({
        error: e.message || "Erro ao gerar relatório de faturamento.",
      });
    }
  }

  // GET /reports/appointments-detail
  async getAppointmentsDetail(req: Request, res: Response) {
    try {
      const prestadorId = (req as any).prestadorId!;
      const { startDate, endDate, statusPagamento, term } =
        req.query as unknown as RevenueQueryDTO;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate e endDate são obrigatórios." });
      }

      const result = await getFinancialDetailsService.execute(prestadorId, {
        startDate,
        endDate,
        statusPagamento,
        term,
      });
      return res.json(result);
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e.message || "Erro ao obter detalhes financeiros." });
    }
  }

  // PATCH /reports/payment/:id
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const prestadorId = (req as any).prestadorId!;
      const idParam = (req.params as Record<string, string> | undefined)?.[
        "id"
      ];
      if (!idParam) {
        return res.status(400).json({ error: "Parâmetro 'id' é obrigatório." });
      }
      const agendamentoId = String(idParam);
      const newStatus = String(req.body?.status) as "pago" | "pendente";

      if (!["pago", "pendente"].includes(newStatus)) {
        return res.status(400).json({
          error: "Status de pagamento deve ser 'pago' ou 'pendente'.",
        });
      }

      const updated = await updatePaymentStatusService.execute(
        prestadorId,
        agendamentoId,
        newStatus
      );
      return res.json(updated);
    } catch (e: any) {
      const status = e.message.includes("não encontrado") ? 404 : 400;
      return res.status(status).json({ error: e.message });
    }
  }
}

export const reportController = new ReportController();
