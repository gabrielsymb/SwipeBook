import type { UpdateServiceDTO } from "../dtos/UpdateServiceDTO.js";
import { serviceRepository } from "../repositorios/ServiceRepository.js";

export class UpdateServiceService {
  async execute(prestadorId: string, id: string, data: UpdateServiceDTO) {
    const existing = await serviceRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!existing)
      throw new Error("Serviço não encontrado ou não pertence ao prestador.");
    if (data.preco !== undefined && data.preco < 0)
      throw new Error("O preço não pode ser negativo.");
    return serviceRepository.update(id, data);
  }
}

export const updateServiceService = new UpdateServiceService();
