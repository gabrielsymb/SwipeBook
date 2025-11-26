import { prisma } from "../../../config/prisma.js";

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
      where: { id, prestador_id: prestadorId },
    });
  }
}

export const serviceRepository = new ServiceRepository();
