import { clientRepository } from "../repositorios/ClientRepository.js";

export class TogglePendenciaService {
  // Marca/desmarca pendencia para um cliente
  async execute(prestadorId: string, id: string, pendencia: boolean) {
    const existing = await clientRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!existing)
      throw new Error("Cliente não encontrado ou não pertence ao prestador");
    return clientRepository.togglePendencia(id, pendencia);
  }
}

export const togglePendenciaService = new TogglePendenciaService();
