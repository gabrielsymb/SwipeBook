import type { Request, Response, Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { clientController } from "../controladores/ClientController.js";

// Definição das rotas específicas do módulo de clientes.
// Mantemos cada módulo isolado para facilitar evolução e manutenção.
export function registerClientRoutes(router: Router): void {
  // Aplica autenticação/autorização a todas as rotas do recurso /clientes
  router.use("/clientes", authMiddleware);
  // Criação
  router.post("/clientes", (req: Request, res: Response): void => {
    clientController.create(req, res);
  });

  // Listagem com paginação / busca
  router.get("/clientes", (req: Request, res: Response): void => {
    clientController.list(req, res);
  });

  // Autocomplete (uso em formulários/Agendamentos)
  router.get("/clientes/autocomplete", (req: Request, res: Response): void => {
    clientController.autocomplete(req, res);
  });

  // Detalhe
  router.get("/clientes/:id", (req: Request, res: Response): void => {
    clientController.getById(req, res);
  });

  // Atualização (PUT para subtituição parcial/total conforme convenção do projeto)
  router.put("/clientes/:id", (req: Request, res: Response): void => {
    clientController.update(req, res);
  });

  // Toggle de pendência (ação pontual)
  router.patch(
    "/clientes/:id/pendencia",
    (req: Request, res: Response): void => {
      clientController.togglePendencia(req, res);
    }
  );

  // Remoção
  router.delete("/clientes/:id", (req: Request, res: Response): void => {
    clientController.delete(req, res);
  });
}
