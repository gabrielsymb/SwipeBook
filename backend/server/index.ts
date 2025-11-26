// server/index.ts
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import buildRouter from "../rotas/index.js";

async function bootstrap(): Promise<void> {
  try {
    console.log("[BOOT] Iniciando servidor...");
    const app = express();
    app.use(express.json());

    app.use((req: Request, _res: Response, next: NextFunction): void => {
      console.log(`[REQ] ${req.method} ${req.url}`);
      next();
    });

    app.use(buildRouter());

    app.get("/health", (_req: Request, res: Response): void => {
      res.json({ status: "ok" });
    });

    // CORREÇÃO: Sintaxe correta para variável de ambiente
    const PORT: number | string = process.env["PORT"] || 3000;
    app.listen(PORT, (): void => {
      console.log(`[BOOT] Servidor iniciado na porta ${PORT}`);
    });
  } catch (err: unknown) {
    console.error("[BOOT][ERRO] Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

bootstrap();
