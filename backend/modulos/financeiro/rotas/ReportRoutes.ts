import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { reportController } from "../controladores/ReportController.js";

export function registerReportRoutes(router: Router) {
  // Todas as rotas de relatórios são protegidas
  router.use("/reports", authMiddleware);

  // GET /reports/revenue?startDate=...&endDate=...
  router.get("/reports/revenue", (req, res) => {
    reportController.getRevenue(req, res);
  });

  // GET /reports/appointments-detail?startDate=...&endDate=...
  router.get("/reports/appointments-detail", (req, res) => {
    reportController.getAppointmentsDetail(req, res);
  });

  // PATCH /reports/payment/:id
  router.patch("/reports/payment/:id", (req, res) => {
    reportController.updatePaymentStatus(req, res);
  });
}
