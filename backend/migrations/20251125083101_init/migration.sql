-- CreateEnum
CREATE TYPE "AgendamentoStatus" AS ENUM ('scheduled', 'in_progress', 'done', 'canceled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'paid', 'partial', 'refunded');

-- CreateTable
CREATE TABLE "prestadores" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prestadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "prestador_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(50),
    "email" VARCHAR(255),
    "pendencia" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" UUID NOT NULL,
    "prestador_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao_min" INTEGER NOT NULL DEFAULT 30,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" UUID NOT NULL,
    "prestador_id" UUID NOT NULL,
    "cliente_id" UUID,
    "servico_id" UUID NOT NULL,
    "data_agendada" TIMESTAMP(6) NOT NULL,
    "status" "AgendamentoStatus" NOT NULL DEFAULT 'scheduled',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
    "iniciado_em" TIMESTAMP(6),
    "finalizado_em" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "prestador_id" UUID NOT NULL,
    "agendamento_id" UUID,
    "event_type" VARCHAR(50) NOT NULL,
    "user_actor_id" UUID,
    "metadata" JSONB,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_email_key" ON "prestadores"("email");

-- CreateIndex
CREATE INDEX "clientes_prestador_id_idx" ON "clientes"("prestador_id");

-- CreateIndex
CREATE INDEX "servicos_prestador_id_idx" ON "servicos"("prestador_id");

-- CreateIndex
CREATE INDEX "agendamentos_prestador_id_idx" ON "agendamentos"("prestador_id");

-- CreateIndex
CREATE INDEX "agendamentos_cliente_id_idx" ON "agendamentos"("cliente_id");

-- CreateIndex
CREATE INDEX "agendamentos_servico_id_idx" ON "agendamentos"("servico_id");

-- CreateIndex
CREATE INDEX "agendamentos_prestador_id_data_agendada_idx" ON "agendamentos"("prestador_id", "data_agendada");

-- CreateIndex
CREATE INDEX "audit_logs_prestador_id_idx" ON "audit_logs"("prestador_id");

-- CreateIndex
CREATE INDEX "audit_logs_agendamento_id_idx" ON "audit_logs"("agendamento_id");

-- CreateIndex
CREATE INDEX "audit_logs_event_type_idx" ON "audit_logs"("event_type");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_prestador_id_fkey" FOREIGN KEY ("prestador_id") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_prestador_id_fkey" FOREIGN KEY ("prestador_id") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_prestador_id_fkey" FOREIGN KEY ("prestador_id") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_prestador_id_fkey" FOREIGN KEY ("prestador_id") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
