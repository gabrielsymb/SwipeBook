import type { Request, Response } from "express";
import { registerService } from "../servicos/RegisterService.js";

export class RegisterController {
  async register(req: Request, res: Response) {
    try {
      const dto = req.body;
      const result = await registerService.execute(dto);
      return res.status(201).json(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message.includes("obrigat")) {
          return res.status(400).json({ error: e.message });
        }
        if (e.message.includes("cadastrado")) {
          return res.status(409).json({ error: e.message });
        }
      }
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao tentar registrar" });
    }
  }
}

export const registerController = new RegisterController();
