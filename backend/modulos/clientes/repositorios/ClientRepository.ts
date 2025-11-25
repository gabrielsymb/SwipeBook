import { prisma } from "../../../config/prisma";
import { CreateClientDTO } from "../dtos/CreateClientDTO";

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

  // Busca cliente por email DENTRO de um prestador.
  // Justificativa: garantia de unicidade contextual (mesmo email não duplicado para o mesmo dono de agenda).
  async findByEmail(prestadorId: string, email: string) {
    return prisma.clientes.findFirst({
      where: { prestador_id: prestadorId, email },
    });
  }
}

export const clientRepository = new ClientRepository();
