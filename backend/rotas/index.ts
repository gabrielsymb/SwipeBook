import { Router } from "express";
import { registerAppointmentRoutes } from "../modulos/agendamentos/rotas/AppointmentRoutes.js";
import { registerAuthRoutes } from "../modulos/autenticacao/rotas/AuthRoutes.js";
import { registerClientRoutes } from "../modulos/clientes/rotas/ClientRoutes.js";
import { registerServiceRoutes } from "../modulos/servicos/rotas/ServiceRoutes.js";
import { registerSessionRoutes } from "../modulos/sessoes/rotas/SessionRoutes.js";

// Router agregador
export function buildRouter() {
  const router = Router();
  registerClientRoutes(router);
  registerAuthRoutes(router);
  registerAppointmentRoutes(router);
  registerServiceRoutes(router);
  registerSessionRoutes(router);
  return router;
}

// Export default para facilitar import 'index.js'
export default buildRouter;
