import { Router } from "express";
import { authController } from "../controladores/AuthController.js";

export function registerAuthRoutes(router: Router) {
  // Rota pública de login
  router.post("/login", (req, res) => {
    authController.login(req, res);
  });
}
