import { Router } from "express";
import { appointmentController } from "../controladores/AppointmentController";

// Registra rotas relacionadas a agendamentos.
export function registerAppointmentRoutes(router: Router) {
  router.post("/appointments", (req, res) =>
    appointmentController.create(req, res)
  );
  router.patch("/appointments/:id/start", (req, res) =>
    appointmentController.start(req, res)
  );
  router.patch("/appointments/:id/finish", (req, res) =>
    appointmentController.finish(req, res)
  );
  router.patch("/appointments/:id/cancel", (req, res) =>
    appointmentController.cancel(req, res)
  );
}
