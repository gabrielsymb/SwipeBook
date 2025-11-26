-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "prestador_id" UUID NOT NULL,
    "agendamento_id" UUID NOT NULL,
    "started_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_heartbeat_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "elapsed_ms" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "stopped_at" TIMESTAMP(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_agendamento_id_key" ON "sessions"("agendamento_id");

-- CreateIndex
CREATE INDEX "sessions_prestador_id_agendamento_id_idx" ON "sessions"("prestador_id", "agendamento_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_prestador_id_fkey" FOREIGN KEY ("prestador_id") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
