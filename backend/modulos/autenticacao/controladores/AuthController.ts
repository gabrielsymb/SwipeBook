import type { Request, Response } from "express";
import { loginService, type LoginDTO } from "../servicos/LoginService.js";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const dto = req.body as LoginDTO;
      if (!dto.email || !dto.senha) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios." });
      }
      const result = await loginService.execute(dto);
      return res.json(result);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "Credenciais inválidas.") {
        return res.status(401).json({ error: "Email ou senha incorretos." });
      }
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao tentar login" });
    }
  }
}

export const authController = new AuthController();
