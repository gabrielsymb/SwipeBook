import { sessionRepository } from "../repositorios/SessionRepository.js";

export class GetActiveSessionService {
  async execute(prestadorId: string) {
    return sessionRepository.findActiveByPrestador(prestadorId);
  }
}

export const getActiveSessionService = new GetActiveSessionService();
