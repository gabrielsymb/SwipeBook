import { prisma } from "../../../config/prisma.js";

// Repositório de Serviços (servicos)
// Responsável apenas por acesso a dados (nenhuma regra de negócio).
export class ServiceRepository {
  async findById(id: string) {
    return prisma.servicos.findUnique({
      where: { id },
      select: { id: true, duracao_min: true, preco: true },
    });
  }
}

export const serviceRepository = new ServiceRepository();
