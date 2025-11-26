import { clientRepository } from "../repositorios/ClientRepository.js";

export class GetClientService {
  // Retorna um cliente verificando pertencimento ao prestador
  async execute(prestadorId: string, id: string) {
    const client = await clientRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!client)
      throw new Error("Cliente não encontrado ou não pertence ao prestador");
    return client;
  }
}

export const getClientService = new GetClientService();
