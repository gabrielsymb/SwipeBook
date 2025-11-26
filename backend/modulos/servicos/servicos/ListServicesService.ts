import { serviceRepository } from "../repositorios/ServiceRepository.js";

export class ListServicesService {
  async execute(prestadorId: string) {
    return serviceRepository.listByPrestador(prestadorId);
  }
}

export const listServicesService = new ListServicesService();
