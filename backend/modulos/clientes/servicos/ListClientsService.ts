import { clientRepository } from "../repositorios/ClientRepository.js";

export class ListClientsService {
  // Lista clientes de um prestador com busca simples por nome
  async execute(
    prestadorId: string,
    opts: { term?: string; page?: number; pageSize?: number }
  ) {
    const { term, page = 1, pageSize = 20 } = opts;
    if (term) {
      // Pesquisa por nome quando termo fornecido
      return clientRepository.searchByName(prestadorId, term);
    }
    return clientRepository.listByPrestador(prestadorId, page, pageSize);
  }
}

export const listClientsService = new ListClientsService();
