import { Router } from "express";
import { authController } from "../controladores/AuthController.js";
import { registerController } from "../controladores/RegisterController.js";

export function registerAuthRoutes(router: Router) {
  // Rota pública de login
  router.post("/login", (req, res) => {
    authController.login(req, res);
  });

  // Rota pública de registro
  router.post("/register", (req, res) => {
    registerController.register(req, res);
  });
}
