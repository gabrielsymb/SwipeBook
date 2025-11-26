import type { Request, Response } from "express";
import type { CreateServiceDTO } from "../dtos/CreateServiceDTO.js";
import type { UpdateServiceDTO } from "../dtos/UpdateServiceDTO.js";
import { createServiceService } from "../servicos/CreateServiceService.js";
import { deleteServiceService } from "../servicos/DeleteServiceService.js";
import { listServicesService } from "../servicos/ListServicesService.js";
import { updateServiceService } from "../servicos/UpdateServiceService.js";

export class ServiceController {
  async create(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const dto = req.body as CreateServiceDTO;
      const result = await createServiceService.execute(prestadorId, dto);
      return res.status(201).json(result);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const result = await listServicesService.execute(prestadorId);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const id = String((req.params as any)["id"]);
      const dto = req.body as UpdateServiceDTO;
      const result = await updateServiceService.execute(prestadorId, id, dto);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const id = String((req.params as any)["id"]);
      await deleteServiceService.execute(prestadorId, id);
      return res.status(204).send();
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export const serviceController = new ServiceController();
