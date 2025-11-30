import type { NextFunction, Request, Response } from "express";

// Estende a interface Request localmente para incluir prestadorId.
declare module "express-serve-static-core" {
  interface Request {
    prestadorId?: string;
  }
}

// Middleware de autenticação temporária baseado em cabeçalho.
// Permite rotas públicas e busca x-auth-prestador ou x-prestador-id.
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const rotasPublicas = ["/auth/login", "/auth/register"];

  if (rotasPublicas.includes(req.path)) return next();

  const rawHeader = (req.headers["x-auth-prestador"] ??
    req.headers["x-prestador-id"]) as string | string[] | undefined;

  const prestadorId = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

  if (!prestadorId) {
    return res
      .status(401)
      .json({ error: "Não autorizado: x-auth-prestador ausente" });
  }

  req.prestadorId = prestadorId;
  return next();
}
