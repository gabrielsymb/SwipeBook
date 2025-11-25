/*
  Warnings:

  - You are about to drop the column `event_type` on the `audit_logs` table. All the data in the column will be lost.
  - Added the required column `position_index` to the `agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CRIACAO', 'ATUALIZACAO', 'STATUS_MUDOU', 'REPOSICIONADO', 'INICIADO', 'FINALIZADO', 'CANCELADO', 'EXCLUIDO', 'REAGENDADO');

-- AlterEnum
ALTER TYPE "AgendamentoStatus" ADD VALUE 'deleted';

-- DropIndex
DROP INDEX "audit_logs_event_type_idx";

-- AlterTable
ALTER TABLE "agendamentos" ADD COLUMN     "canceled_at" TIMESTAMP(6),
ADD COLUMN     "position_index" INTEGER NOT NULL,
ADD COLUMN     "previous_start_at" TIMESTAMP(6),
ADD COLUMN     "real_duration_min" INTEGER,
ADD COLUMN     "rescheduled_at" TIMESTAMP(6),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "event_type",
ADD COLUMN     "action" "AuditAction" NOT NULL,
ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "entidade" VARCHAR(50);

-- CreateIndex
CREATE INDEX "agendamentos_prestador_id_data_agendada_position_index_idx" ON "agendamentos"("prestador_id", "data_agendada", "position_index");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
