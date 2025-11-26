import type { Request, Response } from "express";
import type { StartAppointmentDTO } from "../dtos/StartAppointmentDTO.js";
import { ConcurrencyError } from "../servicos/RescheduleAppointmentService.js";
import { startAppointmentService } from "../servicos/StartAppointmentService.js";

export class StartAppointmentController {
  async start(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const dto: StartAppointmentDTO = { agendamentoId: idParam };
      const updated = await startAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      if (e instanceof ConcurrencyError) {
        return res.status(409).json({ error: e.message });
      }
      return res.status(400).json({ error: e?.message || String(e) });
    }
  }
}

export const startAppointmentController = new StartAppointmentController();
