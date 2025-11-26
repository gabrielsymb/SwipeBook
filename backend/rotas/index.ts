import { Router } from "express";
import { registerAppointmentRoutes } from "../modulos/agendamentos/rotas/AppointmentRoutes.js";
import { registerClientRoutes } from "../modulos/clientes/rotas/ClientRoutes.js";

// Router agregador
export function buildRouter() {
  const router = Router();
  registerClientRoutes(router);
  registerAppointmentRoutes(router);
  return router;
}

// Export default para facilitar import 'index.js'
export default buildRouter;
