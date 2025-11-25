import { Request, Response } from "express";
import { CancelAppointmentDTO } from "../dtos/CancelAppointmentDTO";
import { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO";
import { FinishAppointmentDTO } from "../dtos/FinishAppointmentDTO";
import { StartAppointmentDTO } from "../dtos/StartAppointmentDTO";
import { cancelAppointmentService } from "../servicos/CancelAppointmentService";
import { createAppointmentService } from "../servicos/CreateAppointmentService";
import { finishAppointmentService } from "../servicos/FinishAppointmentService";
import { startAppointmentService } from "../servicos/StartAppointmentService";

// Controller de agendamentos: somente orquestra HTTP -> Serviços.
export class AppointmentController {
  private extractPrestadorId(req: Request): string | null {
    const pid = req.headers["x-prestador-id"];
    return typeof pid === "string" ? pid : null;
  }

  async create(req: Request, res: Response) {
    try {
      const prestadorId = this.extractPrestadorId(req);
      if (!prestadorId)
        return res.status(400).json({ error: "x-prestador-id obrigatório" });
      const dto = req.body as CreateAppointmentDTO;
      const created = await createAppointmentService.execute(prestadorId, dto);
      return res.status(201).json(created);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async start(req: Request, res: Response) {
    try {
      const prestadorId = this.extractPrestadorId(req);
      if (!prestadorId)
        return res.status(400).json({ error: "x-prestador-id obrigatório" });
      const dto: StartAppointmentDTO = { agendamentoId: req.params.id };
      const updated = await startAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async finish(req: Request, res: Response) {
    try {
      const prestadorId = this.extractPrestadorId(req);
      if (!prestadorId)
        return res.status(400).json({ error: "x-prestador-id obrigatório" });
      const dto: FinishAppointmentDTO = { agendamentoId: req.params.id };
      const updated = await finishAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const prestadorId = this.extractPrestadorId(req);
      if (!prestadorId)
        return res.status(400).json({ error: "x-prestador-id obrigatório" });
      const dto: CancelAppointmentDTO = { agendamentoId: req.params.id };
      const updated = await cancelAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export const appointmentController = new AppointmentController();
