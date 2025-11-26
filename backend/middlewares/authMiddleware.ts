import type { NextFunction, Request, Response } from "express";

// Middleware de autenticação temporária baseado em cabeçalho.
// Busca x-auth-prestador ou x-prestador-id e injeta em req.prestadorId.
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headerValor = (req.headers["x-auth-prestador"] ??
    req.headers["x-prestador-id"]) as unknown;
  const prestadorId = typeof headerValor === "string" ? headerValor : null;
  if (!prestadorId) {
    return res
      .status(401)
      .json({ error: "Não autorizado: x-auth-prestador ausente" });
  }
  // Anexa no request (com augmentation de tipos via arquivo .d.ts)
  req.prestadorId = prestadorId;
  return next();
}
