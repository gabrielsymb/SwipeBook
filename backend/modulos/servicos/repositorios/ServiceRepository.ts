import { prisma } from "../../../config/prisma.js";
import type { CreateServiceDTO } from "../dtos/CreateServiceDTO.js";
import type { UpdateServiceDTO } from "../dtos/UpdateServiceDTO.js";

// Deriva o tipo diretamente do Prisma Client
export type Servico = NonNullable<
  Awaited<ReturnType<typeof prisma.servicos.findUnique>>
>;

// Repositório para operações de CRUD e busca de Serviços.
export class ServiceRepository {
  /** Busca um serviço pelo ID. */
  async findById(id: string): Promise<Servico | null> {
    return prisma.servicos.findUnique({ where: { id } });
  }

  /** Busca um serviço pelo ID e garante que ele pertence ao Prestador. */
  async findByIdAndPrestadorId(
    id: string,
    prestadorId: string
  ): Promise<Servico | null> {
    return prisma.servicos.findFirst({
      where: { id, prestador_id: prestadorId, deleted_at: null },
    });
  }

  // Cria novo serviço
  async create(prestadorId: string, data: CreateServiceDTO) {
    return prisma.servicos.create({
      data: {
        prestador_id: prestadorId,
        nome: data.nome,
        preco: data.preco,
        duracao_min: data.duracao_min ?? 30,
      },
    });
  }

  // Lista serviços ativos (não deletados)
  async listByPrestador(prestadorId: string) {
    return prisma.servicos.findMany({
      where: { prestador_id: prestadorId, deleted_at: null },
      orderBy: { nome: "asc" },
    });
  }

  // Atualiza serviço
  async update(id: string, data: UpdateServiceDTO) {
    return prisma.servicos.update({
      where: { id },
      data: {
        ...data,
        atualizado_em: new Date(),
      },
    });
  }

  // Soft Delete (Marca data de exclusão)
  async softDelete(id: string) {
    return prisma.servicos.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

export const serviceRepository = new ServiceRepository();
