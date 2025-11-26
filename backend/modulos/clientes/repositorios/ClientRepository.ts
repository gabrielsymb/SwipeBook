import { prisma } from "../../../config/prisma.js";
import type { CreateClientDTO } from "../dtos/CreateClientDTO.js";

// Repositório responsável POR ACESSO A DADOS da entidade Cliente.
// IMPORTANTE: Aqui NÃO colocamos regra de negócio. Apenas persistência e consultas.
// Motivação: separar preocupações facilita testes e manutenção.
export class ClientRepository {
  // Cria um novo cliente persistindo no banco via Prisma.
  // Observação: valores default são definidos no schema (ex: pendencia=false)
  async create(prestadorId: string, data: CreateClientDTO) {
    return prisma.clientes.create({
      data: {
        prestador_id: prestadorId,
        nome: data.nome,
        email: data.email ?? null,
        telefone: data.telefone ?? null,
        pendencia: data.pendencia ?? false,
      },
    });
  }

  // Lista todos os clientes de um prestador (paginação simples opcional)
  async listByPrestador(prestadorId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    return prisma.clientes.findMany({
      where: { prestador_id: prestadorId },
      orderBy: { criado_em: "desc" },
      skip,
      take: pageSize,
    });
  }

  // Busca cliente por email DENTRO de um prestador.
  // Justificativa: garantia de unicidade contextual (mesmo email não duplicado para o mesmo dono de agenda).
  async findByEmail(prestadorId: string, email: string) {
    return prisma.clientes.findFirst({
      where: { prestador_id: prestadorId, email },
    });
  }

  // Busca cliente por ID
  async findById(id: string) {
    return prisma.clientes.findUnique({
      where: { id },
    });
  }

  // Atualiza dados básicos de um cliente
  async update(
    id: string,
    data: Partial<Omit<CreateClientDTO, "pendencia"> & { pendencia?: boolean }>
  ) {
    const updateData: Record<string, unknown> = { atualizado_em: new Date() };
    if (data["nome"] !== undefined) updateData["nome"] = data["nome"];
    if (data["email"] !== undefined)
      updateData["email"] = data["email"] ?? null;
    if (data["telefone"] !== undefined)
      updateData["telefone"] = data["telefone"] ?? null;
    if (data["pendencia"] !== undefined)
      updateData["pendencia"] = data["pendencia"];
    return prisma.clientes.update({
      where: { id },
      data: updateData,
    });
  }

  // Marca pendencia TRUE/FALSE
  async togglePendencia(id: string, pendencia: boolean) {
    return prisma.clientes.update({
      where: { id },
      data: { pendencia, atualizado_em: new Date() },
      select: { id: true, pendencia: true },
    });
  }

  // Remove definitivamente (se quiser futuramente usar soft delete, ajustar schema)
  async delete(id: string) {
    return prisma.clientes.delete({ where: { id } });
  }

  // Pesquisa textual simples por nome (case-insensitive) dentro de um prestador
  async searchByName(prestadorId: string, term: string) {
    return prisma.clientes.findMany({
      where: {
        prestador_id: prestadorId,
        nome: { contains: term, mode: "insensitive" },
      },
      orderBy: { nome: "asc" },
      take: 50,
    });
  }
}

export const clientRepository = new ClientRepository();
