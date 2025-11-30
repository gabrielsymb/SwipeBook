import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { appointmentController } from "../controladores/AppointmentController.js";
import { cancelAppointmentController } from "../controladores/CancelAppointmentController.js";
import { deleteAppointmentController } from "../controladores/DeleteAppointmentController.js";
import { finishAppointmentController } from "../controladores/FinishAppointmentController.js";
import { reorderAppointmentController } from "../controladores/ReorderAppointmentController.js";
import { rescheduleAppointmentController } from "../controladores/RescheduleAppointmentController.js";
import { startAppointmentController } from "../controladores/StartAppointmentController.js";

// Registra rotas relacionadas a agendamentos.
export function registerAppointmentRoutes(router: Router): void {
  // Cria um sub-router para isolar o middleware de autenticação
  const r = Router();
  // Aplica autenticação apenas neste sub-router
  r.use(authMiddleware);

  // Rotas antigas em inglês (manter compatibilidade) - definidas no sub-router
  r.post("/", (req: Request, res: Response): void => {
    appointmentController.create(req, res);
  });
  r.patch("/:id/start", (req: Request, res: Response): void => {
    appointmentController.start(req, res);
  });
  r.patch("/:id/finish", (req: Request, res: Response): void => {
    appointmentController.finish(req, res);
  });
  r.patch("/:id/cancel", (req: Request, res: Response): void => {
    appointmentController.cancel(req, res);
  });
  r.patch("/:id/reschedule", (req: Request, res: Response): void => {
    appointmentController.reschedule(req, res);
  });

  // Nova rota em português (UC06): Reagendar
  r.patch(
    "/agendamentos/:id/reagendar",
    (req: Request, res: Response): void => {
      rescheduleAppointmentController.handle(req, res);
    }
  );

  // Iniciar atendimento (UC02) - rota em português
  r.patch("/agendamentos/:id/iniciar", (req: Request, res: Response): void => {
    startAppointmentController.start(req, res);
  });

  // Finalizar atendimento (UC03) - rota em português
  r.patch(
    "/agendamentos/:id/finalizar",
    (req: Request, res: Response): void => {
      finishAppointmentController.finish(req, res);
    }
  );

  // UC08: Reposicionar no dia (reorder)
  r.patch("/agendamentos/:id/reorder", (req: Request, res: Response): void => {
    reorderAppointmentController.handle(req, res);
  });
  // Cancelar (UC04)
  r.patch("/agendamentos/:id/cancel", (req: Request, res: Response): void => {
    cancelAppointmentController.cancel(req, res);
  });
  // Excluir lógico (UC05)
  r.patch("/agendamentos/:id/delete", (req: Request, res: Response): void => {
    deleteAppointmentController.delete(req, res);
  });

  // Monta o sub-router com dois prefixes para compatibilidade
  // '/appointments' (rotas inglesas) e '/agendamentos' (rotas portuguesas)
  router.use('/appointments', r);
  router.use('/agendamentos', r);
}
