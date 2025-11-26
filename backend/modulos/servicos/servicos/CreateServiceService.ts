import type { CreateServiceDTO } from "../dtos/CreateServiceDTO.js";
import { serviceRepository } from "../repositorios/ServiceRepository.js";

export class CreateServiceService {
  async execute(prestadorId: string, data: CreateServiceDTO) {
    if (!data.nome || data.nome.trim().length < 2) {
      throw new Error("Nome do serviço é obrigatório.");
    }
    if (data.preco < 0) {
      throw new Error("O preço não pode ser negativo.");
    }
    return serviceRepository.create(prestadorId, data);
  }
}

export const createServiceService = new CreateServiceService();
