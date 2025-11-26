import type { Request, Response } from "express";
import type { ReorderAppointmentDTO } from "../dtos/ReorderAppointmentDTO.js";
import { reorderAppointmentService } from "../servicos/ReorderAppointmentService.js";

export class ReorderAppointmentController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }

      const { keyBefore: keyBeforeRaw, keyAfter: keyAfterRaw, dataAgendada: dataAgendadaRaw } = req.body ?? {};

      const keyBefore = keyBeforeRaw === undefined ? null : keyBeforeRaw;
      const keyAfter = keyAfterRaw === undefined ? null : keyAfterRaw;

      if (keyBefore !== null && typeof keyBefore !== "string") {
        return res.status(400).json({ error: "keyBefore deve ser string ou null" });
      }
      if (keyAfter !== null && typeof keyAfter !== "string") {
        return res.status(400).json({ error: "keyAfter deve ser string ou null" });
      }
      if (!dataAgendadaRaw) {
        return res.status(400).json({ error: "dataAgendada é obrigatória" });
      }
      const dataAgendada = new Date(dataAgendadaRaw);
      if (Number.isNaN(dataAgendada.getTime())) {
        return res.status(400).json({ error: "dataAgendada inválida" });
      }

      const dto: ReorderAppointmentDTO = {
        agendamentoId: idParam,
        prestadorId,
        keyBefore,
        keyAfter,
        dataAgendada,
      };

      const updated = await reorderAppointmentService.execute(dto);
      return res.json(updated);
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : String(e);
      if (msg.startsWith("CONCURRENCY_ERROR")) {
        return res.status(409).json({ error: msg });
      }
      return res.status(400).json({ error: msg });
    }
  }
}

export const reorderAppointmentController = new ReorderAppointmentController();
