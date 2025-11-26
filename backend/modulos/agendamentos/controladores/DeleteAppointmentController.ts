import type { Request, Response } from "express";
import {
  deleteAppointmentService,
  type DeleteAppointmentDTO,
} from "../servicos/DeleteAppointmentService.js";

export class DeleteAppointmentController {
  /**
   * Exclui permanentemente um agendamento (:id).
   * Entrada: req.prestadorId, req.params.id
   * Saída: JSON do agendamento removido/resultado ou erro 400.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const prestadorId = req.prestadorId as string;
      const idParam = req.params["id"];
      if (typeof idParam !== "string" || idParam.length === 0) {
        return res.status(400).json({ error: "id parâmetro obrigatório" });
      }
      const dto: DeleteAppointmentDTO = { agendamentoId: idParam };
      const updated = await deleteAppointmentService.execute(prestadorId, dto);
      return res.json(updated);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      return res.status(400).json({ error: msg });
    }
  }
}
export const deleteAppointmentController = new DeleteAppointmentController();
