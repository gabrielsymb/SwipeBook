import bcrypt from "bcrypt";
import { prisma } from "../../../config/prisma.js";
import type { ChangePasswordDTO } from "../dtos/ChangePasswordDTO.js";

const SALT_ROUNDS = Number(process.env["SALT_ROUNDS"] ?? 10);

export class ChangePasswordService {
  async execute(
    prestadorId: string,
    { senhaAntiga, senhaNova }: ChangePasswordDTO
  ) {
    const prestador = await prisma.prestadores.findUnique({
      where: { id: prestadorId },
    });
    if (!prestador) throw new Error("Prestador não encontrado.");

    const senhaValida = await bcrypt.compare(senhaAntiga, prestador.senha_hash);
    if (!senhaValida) throw new Error("Senha antiga incorreta.");

    if (!senhaNova || senhaNova.length < 6)
      throw new Error("A nova senha deve ter pelo menos 6 caracteres.");

    const novaSenhaHash = await bcrypt.hash(senhaNova, SALT_ROUNDS);
    await prisma.prestadores.update({
      where: { id: prestadorId },
      data: { senha_hash: novaSenhaHash },
    });

    return { message: "Senha alterada com sucesso." };
  }
}

export const changePasswordService = new ChangePasswordService();
