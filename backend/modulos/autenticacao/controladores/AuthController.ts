import type { Request, Response } from "express";
import { loginService, type LoginDTO } from "../servicos/LoginService.js";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      // Aceita tanto { email, senha } quanto { email, password } vindos do frontend
      const email = req.body?.email as string | undefined;
      const password = (req.body?.password ?? req.body?.senha) as
        | string
        | undefined;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios." });
      }

      const dto: LoginDTO = { email, password };
      const result = await loginService.execute(dto);

      // Normaliza a resposta para o formato esperado pelo frontend
      return res.json({
        token: result.token,
        prestador: {
          id: result.prestadorId,
          nome: result.nome,
        },
      });
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
