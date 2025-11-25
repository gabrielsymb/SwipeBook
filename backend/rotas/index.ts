import { Router } from "express";
import { registerAppointmentRoutes } from "../modulos/agendamentos/rotas/AppointmentRoutes";
import { registerClientRoutes } from "../modulos/clientes/rotas/ClientRoutes";

// Router agregador: registra rotas de todos os módulos.
// Novos módulos devem expor função semelhante registerXRoutes.
export function buildRouter() {
  const router = Router();
  registerClientRoutes(router);
  registerAppointmentRoutes(router);
  return router;
}

export default buildRouter;
