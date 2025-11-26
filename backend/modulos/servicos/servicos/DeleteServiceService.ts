import { serviceRepository } from "../repositorios/ServiceRepository.js";

export class DeleteServiceService {
  async execute(prestadorId: string, id: string) {
    const existing = await serviceRepository.findByIdAndPrestadorId(
      id,
      prestadorId
    );
    if (!existing) throw new Error("Serviço não encontrado.");
    return serviceRepository.softDelete(id);
  }
}

export const deleteServiceService = new DeleteServiceService();
