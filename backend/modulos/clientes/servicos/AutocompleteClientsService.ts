import { clientRepository } from "../repositorios/ClientRepository.js";

export class AutocompleteClientsService {
  // Serviço fino para alimentar componentes de autocomplete
  async execute(prestadorId: string, term: string, limit = 10) {
    return clientRepository.autocomplete(prestadorId, term, limit);
  }
}

export const autocompleteClientsService = new AutocompleteClientsService();
