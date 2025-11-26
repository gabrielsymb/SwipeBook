import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { appointmentController } from "../controladores/AppointmentController.js";
import { rescheduleAppointmentController } from "../controladores/RescheduleAppointmentController.js";

// Registra rotas relacionadas a agendamentos.
export function registerAppointmentRoutes(router: Router): void {
  // Aplica autenticação para rotas protegidas
  router.use(authMiddleware);
  // Rotas antigas em inglês (manter compatibilidade)
  router.post("/appointments", (req: Request, res: Response): void => {
    appointmentController.create(req, res);
  });
  router.patch(
    "/appointments/:id/start",
    (req: Request, res: Response): void => {
      appointmentController.start(req, res);
    }
  );
  router.patch(
    "/appointments/:id/finish",
    (req: Request, res: Response): void => {
      appointmentController.finish(req, res);
    }
  );
  router.patch(
    "/appointments/:id/cancel",
    (req: Request, res: Response): void => {
      appointmentController.cancel(req, res);
    }
  );
  router.patch(
    "/appointments/:id/reschedule",
    (req: Request, res: Response): void => {
      appointmentController.reschedule(req, res);
    }
  );

  // Nova rota em português (UC06): Reagendar
  router.patch(
    "/agendamentos/:id/reagendar",
    (req: Request, res: Response): void => {
      rescheduleAppointmentController.handle(req, res);
    }
  );
}
