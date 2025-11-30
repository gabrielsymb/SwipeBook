import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../config/prisma.js";

// Use uma chave secreta do .env em produção
const JWT_SECRET: string =
  process.env["JWT_SECRET"] ?? "sua_chave_secreta_padrao";

export interface LoginDTO {
  email: string;
  // Nome usado no frontend: password
  password: string;
}

export class LoginService {
  /**
   * Valida credenciais e retorna token JWT com prestadorId
   */
  async execute({ email, password }: LoginDTO) {
    // Mapeia para o nome interno 'senha' usado no banco
    const senha = password;

    const prestador = await prisma.prestadores.findUnique({ where: { email } });
    if (!prestador) {
      throw new Error("Credenciais inválidas.");
    }

    const senhaValida = await bcrypt.compare(senha, prestador.senha_hash);
    if (!senhaValida) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign({ prestadorId: prestador.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, prestadorId: prestador.id, nome: prestador.nome };
  }
}

export const loginService = new LoginService();
