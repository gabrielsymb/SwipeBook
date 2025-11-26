import type { Request, Response } from "express";
import type { CancelAppointmentDTO } from "../dtos/CancelAppointmentDTO.js";
import type { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO.js";
import type { FinishAppointmentDTO } from "../dtos/FinishAppointmentDTO.js";
import type { RescheduleAppointmentDTO } from "../dtos/RescheduleAppointmentDTO.js";
import type { StartAppointmentDTO } from "../dtos/StartAppointmentDTO.js";
import { cancelAppointmentService } from "../servicos/CancelAppointmentService.js";
import { createAppointmentService } from "../servicos/CreateAppointmentService.js";
import { finishAppointmentService } from "../servicos/FinishAppointmentService.js";
import { rescheduleAppointmentService } from "../servicos/RescheduleAppointmentService.js";
import { startAppointmentService } from "../servicos/StartAppointmentService.js";

// Controller de agendamentos: somente orquestra HTTP -> Serviços.
export class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const dto = req.body as CreateAppointmentDTO;
      const created = await createAppointmentService.execute(prestadorId, dto);
      return res.status(201).json(created);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

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
      return res.status(400).json({ error: e.message });
    }
  }

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
      return res.status(400).json({ error: e.message });
    }
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const dto: CancelAppointmentDTO = { agendamentoId: idParam };
      const updated = await cancelAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async reschedule(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const novoStartAtRaw = req.body?.novoStartAt;
      if (!novoStartAtRaw) {
        return res.status(400).json({ error: "novoStartAt obrigatório" });
      }
      const novoStartAt = new Date(novoStartAtRaw);
      if (isNaN(novoStartAt.getTime())) {
        return res.status(400).json({ error: "novoStartAt inválido" });
      }

      const dto: RescheduleAppointmentDTO = {
        id: idParam,
        novoStartAt,
        prestadorId,
      };
      const updated = await rescheduleAppointmentService.execute(dto);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export const appointmentController = new AppointmentController();
