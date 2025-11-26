import { sessionRepository } from "../repositorios/SessionRepository.js";

export class HeartbeatService {
  // Incrementa elapsed_ms pela diferença enviada (em ms) e atualiza last_heartbeat_at
  async execute(sessionId: string, elapsedDeltaMs: number) {
    const updated = await sessionRepository.updateHeartbeat(
      sessionId,
      elapsedDeltaMs
    );
    return updated;
  }
}

export const heartbeatService = new HeartbeatService();
