import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { sessionController } from "../controladores/SessionController.js";

export function registerSessionRoutes(router: Router) {
  router.use("/sessions", authMiddleware);

  router.post("/sessions", (req, res) => sessionController.start(req, res));
  router.patch("/sessions/:id/heartbeat", (req, res) =>
    sessionController.heartbeat(req, res)
  );
  router.patch("/sessions/:id/pause", (req, res) =>
    sessionController.pause(req, res)
  );
  router.patch("/sessions/:id/resume", (req, res) =>
    sessionController.resume(req, res)
  );
  router.post("/sessions/:id/stop", (req, res) =>
    sessionController.stop(req, res)
  );
  router.get("/sessions/active", (req, res) =>
    sessionController.active(req, res)
  );
}
