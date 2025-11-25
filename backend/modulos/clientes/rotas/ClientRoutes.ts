import { Router } from "express";
import { clientController } from "../controladores/ClientController";

// Definição das rotas específicas do módulo de clientes.
// Mantemos cada módulo isolado para facilitar evolução e manutenção.
export function registerClientRoutes(router: Router) {
  router.post("/clientes", (req, res) => clientController.create(req, res));
}
