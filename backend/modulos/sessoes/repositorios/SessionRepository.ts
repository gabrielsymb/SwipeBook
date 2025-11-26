import { prisma } from "../../../config/prisma.js";

export type Sessao = NonNullable<
  Awaited<ReturnType<typeof prisma.sessions.findUnique>>
>;

export class SessionRepository {
  async create(prestadorId: string, agendamentoId: string) {
    return prisma.sessions.create({
      data: { prestador_id: prestadorId, agendamento_id: agendamentoId },
    });
  }

  async findById(id: string) {
    return prisma.sessions.findUnique({ where: { id } });
  }

  async findActiveByPrestador(prestadorId: string) {
    return prisma.sessions.findFirst({
      where: { prestador_id: prestadorId, status: "active" },
    });
  }

  async updateHeartbeat(id: string, elapsedMsDelta: number) {
    const now = new Date();
    return prisma.sessions.update({
      where: { id },
      data: {
        last_heartbeat_at: now,
        elapsed_ms: { increment: BigInt(elapsedMsDelta) } as any,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.sessions.update({ where: { id }, data: { status } });
  }

  async stop(id: string) {
    const now = new Date();
    return prisma.sessions.update({
      where: { id },
      data: { status: "stopped", stopped_at: now },
    });
  }
}

export const sessionRepository = new SessionRepository();
