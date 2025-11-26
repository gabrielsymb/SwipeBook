-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deleted_at" TIMESTAMP(6);
