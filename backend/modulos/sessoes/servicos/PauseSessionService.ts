import { sessionRepository } from "../repositorios/SessionRepository.js";

export class PauseSessionService {
  async execute(sessionId: string) {
    return sessionRepository.updateStatus(sessionId, "paused");
  }
}

export const pauseSessionService = new PauseSessionService();
