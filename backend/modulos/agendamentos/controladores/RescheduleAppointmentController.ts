import type { Request, Response } from "express";
import type { RescheduleAppointmentDTO } from "../dtos/RescheduleAppointmentDTO.js";
import { rescheduleAppointmentService } from "../servicos/RescheduleAppointmentService.js";

// Controller específico para reagendamento (UC06)
// Mantém responsabilidade focada e comentários em português conforme instrução.
export class RescheduleAppointmentController {
  private extractPrestadorId(req: Request): string | null {
    const pid = req.headers["x-prestador-id"];
    return typeof pid === "string" ? pid : null;
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Validar header do prestador (controla tenant / multi-usuário)
      const prestadorId = this.extractPrestadorId(req);
      if (!prestadorId) {
        return res.status(400).json({ error: "x-prestador-id obrigatório" });
      }

      // 2. Validar entrada mínima (novoStartAt, formato Date)
      const novoStartAtRaw = req.body?.novoStartAt;
      if (!novoStartAtRaw) {
        return res.status(400).json({ error: "novoStartAt obrigatório" });
      }
      const novoStartAt = new Date(novoStartAtRaw);
      if (isNaN(novoStartAt.getTime())) {
        return res.status(400).json({ error: "novoStartAt inválido" });
      }

      // 3. Montar DTO e delegar ao serviço
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const dto: RescheduleAppointmentDTO = {
        id: idParam,
        novoStartAt,
        prestadorId,
      };
      const atualizado = await rescheduleAppointmentService.execute(dto);
      return res.json(atualizado);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message.startsWith("CONCURRENCY_ERROR")) {
          return res
            .status(409)
            .json({ error: "Concorrência: tente novamente" });
        }
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: "Erro desconhecido" });
    }
  }
}

export const rescheduleAppointmentController =
  new RescheduleAppointmentController();
