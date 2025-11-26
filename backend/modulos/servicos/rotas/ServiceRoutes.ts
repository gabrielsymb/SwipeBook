import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { serviceController } from "../controladores/ServiceController.js";

export function registerServiceRoutes(router: Router) {
  // Aplica segurança em todas as rotas de serviços
  router.use("/servicos", authMiddleware);

  router.post("/servicos", (req, res) => {
    serviceController.create(req, res);
  });
  router.get("/servicos", (req, res) => {
    serviceController.list(req, res);
  });
  router.put("/servicos/:id", (req, res) => {
    serviceController.update(req, res);
  });
  router.delete("/servicos/:id", (req, res) => {
    serviceController.delete(req, res);
  });
}
