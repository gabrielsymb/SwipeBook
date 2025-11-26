import type { Request, Response } from "express";
import type { FinishAppointmentDTO } from "../dtos/FinishAppointmentDTO.js";
import { finishAppointmentService } from "../servicos/FinishAppointmentService.js";
import { ConcurrencyError } from "../servicos/RescheduleAppointmentService.js";

export class FinishAppointmentController {
  async finish(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const dto: FinishAppointmentDTO = { agendamentoId: idParam };
      const updated = await finishAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      if (e instanceof ConcurrencyError) {
        return res.status(409).json({ error: e.message });
      }
      return res.status(400).json({ error: e?.message || String(e) });
    }
  }
}

export const finishAppointmentController = new FinishAppointmentController();
