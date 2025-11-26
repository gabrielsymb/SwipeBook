import "express";

declare global {
  namespace Express {
    // Augmenta o Request para conter o prestadorId definido pelo authMiddleware
    interface Request {
      prestadorId?: string;
    }
  }
}

export {};
