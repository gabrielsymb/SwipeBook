import express from "express";
import buildRouter from "../rotas/index";

// Inicialização protegida em try/catch para capturar erros antes de levantar servidor
async function bootstrap() {
  try {
    console.log("[BOOT] Iniciando servidor...");
    const app = express();
    app.use(express.json());

    // Log simples de cada requisição para diagnosticar se está chegando tráfego
    app.use((req, _res, next) => {
      console.log(`[REQ] ${req.method} ${req.url}`);
      next();
    });

    app.use(buildRouter());

    app.get("/health", (_req, res) => res.json({ status: "ok" }));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`[BOOT] Servidor iniciado na porta ${PORT}`);
    });
  } catch (err: any) {
    console.error("[BOOT][ERRO] Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

bootstrap();
