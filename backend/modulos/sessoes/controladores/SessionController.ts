import type { Request, Response } from "express";
import { getActiveSessionService } from "../servicos/GetActiveSessionService.js";
import { heartbeatService } from "../servicos/HeartbeatService.js";
import { pauseSessionService } from "../servicos/PauseSessionService.js";
import { resumeSessionService } from "../servicos/ResumeSessionService.js";
import { startSessionService } from "../servicos/StartSessionService.js";
import { stopSessionService } from "../servicos/StopSessionService.js";

export class SessionController {
  async start(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const { agendamentoId } = req.body;
      const sess = await startSessionService.execute(
        prestadorId,
        String(agendamentoId)
      );
      return res.status(201).json(sess);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async heartbeat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const delta = Number(req.body.elapsedMs) || 0;
      const updated = await heartbeatService.execute(String(id), delta);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async pause(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await pauseSessionService.execute(String(id));
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async resume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await resumeSessionService.execute(String(id));
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async stop(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stopped = await stopSessionService.execute(String(id));
      return res.json(stopped);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async active(req: Request, res: Response) {
    try {
      const prestadorId = req.prestadorId!;
      const s = await getActiveSessionService.execute(prestadorId);
      return res.json(s);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export const sessionController = new SessionController();
