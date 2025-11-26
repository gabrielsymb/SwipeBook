import type { Request, Response } from "express";
import type { CreateClientDTO } from "../dtos/CreateClientDTO.js";
import type { UpdateClientDTO } from "../dtos/UpdateClientDTO.js";
import { autocompleteClientsService } from "../servicos/AutocompleteClientsService.js";
import { createClientService } from "../servicos/CreateClientService.js";
import { deleteClientService } from "../servicos/DeleteClientService.js";
import { getClientService } from "../servicos/GetClientService.js";
import { listClientsService } from "../servicos/ListClientsService.js";
import { togglePendenciaService } from "../servicos/TogglePendenciaService.js";
import { updateClientService } from "../servicos/UpdateClientService.js";

// Controller: camada HTTP. RESPONSABILIDADE:
// 1. Extrair dados da requisição
// 2. Chamar serviço de negócio
// 3. Lidar com status de resposta / formatação
// NÃO contém regra de negócio.
// Observação: o `authMiddleware` valida e injeta `req.prestadorId`.
// Aqui assumimos que `req.prestadorId` existe (usar `!` no TypeScript).
export class ClientController {
  // Cria um novo cliente
  async create(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação (injetado em Request via @types)
      const prestadorId = req.prestadorId!;

      const payload = req.body as CreateClientDTO;
      const client = await createClientService.execute(prestadorId, payload);
      return res.status(201).json(client);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro ao criar cliente" });
    }
  }

  // Lista clientes com paginação e busca simples (query: term, page, pageSize)
  async list(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação (injetado em Request via @types)
      const prestadorId = req.prestadorId!;

      const term =
        typeof (req.query as any)["term"] === "string"
          ? (req.query as any)["term"]
          : undefined;
      const page = Number((req.query as any)["page"]) || 1;
      const pageSize = Number((req.query as any)["pageSize"]) || 20;
      const clients = await listClientsService.execute(prestadorId, {
        term,
        page,
        pageSize,
      });
      return res.status(200).json(clients);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro ao listar clientes" });
    }
  }

  // Autocomplete para inputs (retorna campos mínimos para sugestão)
  async autocomplete(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const term =
        typeof (req.query as any)["term"] === "string"
          ? (req.query as any)["term"]
          : "";
      const limit = Number((req.query as any)["limit"]) || 10;
      const results = await autocompleteClientsService.execute(
        prestadorId,
        term,
        limit
      );
      return res.status(200).json(results);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro no autocomplete" });
    }
  }

  // Retorna detalhes de um cliente por ID
  async getById(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação (injetado em Request via @types)
      const prestadorId = req.prestadorId!;

      const id = String((req.params as any)["id"]);
      const client = await getClientService.execute(prestadorId, id);
      return res.status(200).json(client);
    } catch (err: any) {
      return res
        .status(404)
        .json({ error: err.message || "Cliente não encontrado" });
    }
  }

  // Atualiza dados básicos do cliente
  async update(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação (injetado em Request via @types)
      const prestadorId = req.prestadorId!;

      const id = String((req.params as any)["id"]);
      const payload = req.body as UpdateClientDTO;
      const updated = await updateClientService.execute(
        prestadorId,
        id,
        payload
      );
      return res.status(200).json(updated);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro ao atualizar cliente" });
    }
  }

  // Marca pendência true/false
  async togglePendencia(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação (injetado em Request via @types)
      const prestadorId = req.prestadorId!;

      const id = String((req.params as any)["id"]);
      const pendencia = Boolean(req.body.pendencia);
      const result = await togglePendenciaService.execute(
        prestadorId,
        id,
        pendencia
      );
      return res.status(200).json(result);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro ao atualizar pendência" });
    }
  }

  // Remove cliente (uso do repositório: delete definitivo)
  async delete(req: Request, res: Response) {
    try {
      // Usa o ID garantido pelo Middleware de autenticação
      const prestadorId = (req as any).prestadorId! as string;

      const id = String((req.params as any)["id"]);
      await deleteClientService.execute(prestadorId, id);
      return res.status(204).send();
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "Erro ao remover cliente" });
    }
  }
}

export const clientController = new ClientController();
