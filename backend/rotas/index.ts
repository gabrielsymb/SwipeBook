import { Router } from "express";
import { registerAppointmentRoutes } from "../modulos/agendamentos/rotas/AppointmentRoutes.js";
import { registerAuthRoutes } from "../modulos/autenticacao/rotas/AuthRoutes.js";
import { registerClientRoutes } from "../modulos/clientes/rotas/ClientRoutes.js";
import { registerReportRoutes } from "../modulos/financeiro/rotas/ReportRoutes.js";
import { registerServiceRoutes } from "../modulos/servicos/rotas/ServiceRoutes.js";
import { registerSessionRoutes } from "../modulos/sessoes/rotas/SessionRoutes.js";

// Router agregador
export function buildRouter() {
  const router = Router();

  // Monta sub-routers com prefixos para cada módulo
  router.use(
    "/auth",
    (() => {
      const r = Router();
      registerAuthRoutes(r);
      return r;
    })()
  );

  router.use(
    "/clientes",
    (() => {
      const r = Router();
      registerClientRoutes(r);
      return r;
    })()
  );

  router.use(
    "/agendamentos",
    (() => {
      const r = Router();
      registerAppointmentRoutes(r);
      return r;
    })()
  );

  router.use(
    "/servicos",
    (() => {
      const r = Router();
      registerServiceRoutes(r);
      return r;
    })()
  );

  router.use(
    "/sessoes",
    (() => {
      const r = Router();
      registerSessionRoutes(r);
      return r;
    })()
  );

  router.use(
    "/relatorios",
    (() => {
      const r = Router();
      registerReportRoutes(r);
      return r;
    })()
  );

  return router;
}

// Export default para facilitar import 'index.js'
export default buildRouter;
