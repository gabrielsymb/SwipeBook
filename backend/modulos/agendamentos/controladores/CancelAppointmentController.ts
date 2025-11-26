import type { Request, Response } from "express";
import type { CancelAppointmentDTO } from "../dtos/CancelAppointmentDTO.js";
import { cancelAppointmentService } from "../servicos/CancelAppointmentService.js";

export class CancelAppointmentController {
  /**
   * Cancela um agendamento pelo parâmetro de rota :id.
   * Entrada: req.prestadorId (injetado por middleware), req.params.id
   * Saída: JSON do agendamento atualizado ou erro 400.
   */
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      return res.status(400).json({ error: msg });
    }
  }
}
export const cancelAppointmentController = new CancelAppointmentController();
