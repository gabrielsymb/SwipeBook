import bcrypt from "bcrypt";
import { prisma } from "../../../config/prisma.js";
import type { RegisterDTO } from "../dtos/RegisterDTO.js";

const SALT_ROUNDS = Number(process.env["SALT_ROUNDS"] ?? 10);

export class RegisterService {
  async execute(data: RegisterDTO) {
    if (!data.email || !data.senha || !data.nome) {
      throw new Error("Nome, email e senha são obrigatórios.");
    }

    const existing = await prisma.prestadores.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error("Este email já está cadastrado.");

    const senha_hash = await bcrypt.hash(data.senha, SALT_ROUNDS);

    const newPrestador = await prisma.prestadores.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha_hash,
      },
      select: { id: true, nome: true, email: true, criado_em: true },
    });

    return newPrestador;
  }
}

export const registerService = new RegisterService();
