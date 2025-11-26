import { sessionRepository } from "../repositorios/SessionRepository.js";

export class ResumeSessionService {
  async execute(sessionId: string) {
    return sessionRepository.updateStatus(sessionId, "active");
  }
}

export const resumeSessionService = new ResumeSessionService();
