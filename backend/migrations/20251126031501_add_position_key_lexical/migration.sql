/*
  Warnings:

  - You are about to drop the column `position_index` on the `agendamentos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prestador_id,data_agendada,position_key]` on the table `agendamentos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "agendamentos_prestador_id_data_agendada_position_index_idx";

-- AlterTable
ALTER TABLE "agendamentos" DROP COLUMN "position_index",
ADD COLUMN     "position_key" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "agendamentos_prestador_id_data_agendada_position_key_key" ON "agendamentos"("prestador_id", "data_agendada", "position_key");
