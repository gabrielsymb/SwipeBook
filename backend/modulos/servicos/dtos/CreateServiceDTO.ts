export interface CreateServiceDTO {
  nome: string;
  preco: number; // number será convertido para Decimal pelo Prisma Client
  duracao_min?: number; // opcional
}
