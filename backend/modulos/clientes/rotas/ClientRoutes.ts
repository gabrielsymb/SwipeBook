import type { Request, Response, Router } from "express";
import { clientController } from "../controladores/ClientController.js";

// Definição das rotas específicas do módulo de clientes.
// Mantemos cada módulo isolado para facilitar evolução e manutenção.
export function registerClientRoutes(router: Router): void {
  router.post("/clientes", (req: Request, res: Response): void => {
    clientController.create(req, res);
  });
}
