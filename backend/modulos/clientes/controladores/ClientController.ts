import { Request, Response } from "express";
import { CreateClientDTO } from "../dtos/CreateClientDTO";
import { createClientService } from "../servicos/CreateClientService";

// Controller: camada HTTP. RESPONSABILIDADE:
// 1. Extrair dados da requisição
// 2. Chamar serviço de negócio
// 3. Lidar com status de resposta / formatação
// NÃO contém regra de negócio.
export class ClientController {
  async create(req: Request, res: Response) {
    try {
      // Em uma aplicação real, prestadorId viria do token (auth middleware)
      const prestadorId = req.headers["x-prestador-id"];
      if (typeof prestadorId !== "string" || !prestadorId) {
        return res
          .status(400)
          .json({ error: "Cabeçalho x-prestador-id obrigatório" });
      }

      const payload = req.body as CreateClientDTO;
      const client = await createClientService.execute(prestadorId, payload);
      return res.status(201).json(client);
    } catch (err: any) {
      // Tratamento de erro simples: retorna 400 para erros esperados
      return res
        .status(400)
        .json({ error: err.message || "Erro ao criar cliente" });
    }
  }
}

export const clientController = new ClientController();
