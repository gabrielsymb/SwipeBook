import type { UpdateClientDTO } from "../dtos/UpdateClientDTO.js";
import { clientRepository } from "../repositorios/ClientRepository.js";

export class UpdateClientService {
  // Atualiza dados do cliente com validações básicas
  async execute(prestadorId: string, id: string, data: UpdateClientDTO) {
    // Verifica pertença
    const existing = await clientRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!existing)
      throw new Error("Cliente não encontrado ou não pertence ao prestador");

    // Se email for fornecido, verifica duplicidade
    if (data.email) {
      const other = await clientRepository.findByEmail(prestadorId, data.email);
      if (other && other.id !== id) {
        throw new Error("Email já cadastrado para este prestador");
      }
    }

    return clientRepository.update(id, data as any);
  }
}

export const updateClientService = new UpdateClientService();
