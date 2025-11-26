import { prisma } from "../../../config/prisma.js";
import { clientRepository } from "../../clientes/repositorios/ClientRepository.js";
import { updatePaymentStatusService } from "../../financeiro/servicos/UpdatePaymentStatusService.js";
import { serviceRepository } from "../../servicos/repositorios/ServiceRepository.js";
import { LexicalReorderUtility } from "../../utils/LexicalReorderUtility.js";
import type { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO.js";
import { appointmentRepository } from "../repositorios/AppointmentRepository.js";
import type { AuditActionEnum } from "../repositorios/AuditLogRepository.js";
import { auditLogRepository } from "../repositorios/AuditLogRepository.js";

// Serviço de criação de agendamento.
// Regras principais:
// 1. Status inicial = scheduled
// 2. Não permitir data passada
// 3. Limite de janela futura (14 dias)
// 4. Impedir conflito de horário exato
// 5. Registrar auditoria
export class CreateAppointmentService {
  private readonly MAX_DAYS_AHEAD = 14;

  async execute(prestadorId: string, dto: CreateAppointmentDTO) {
    const dataAgendada = new Date(dto.dataAgendada);
    if (Number.isNaN(dataAgendada.getTime())) {
      throw new Error("Data agendada inválida");
    }

    const now = new Date();
    if (dataAgendada < now) {
      throw new Error("Não é permitido criar em data passada");
    }

    const diffDays =
      (dataAgendada.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > this.MAX_DAYS_AHEAD) {
      throw new Error(`Janela máxima excedida (${this.MAX_DAYS_AHEAD} dias)`);
    }

    const conflict = await appointmentRepository.existsConflict(
      prestadorId,
      dataAgendada
    );
    if (conflict) {
      throw new Error(
        "Conflito de horário: já existe agendamento nesta data/hora"
      );
    }

    // Buscar serviço via repositório de serviços (com validação de pertencimento)
    const servico = await serviceRepository.findByIdAndPrestadorId(
      dto.servicoId,
      prestadorId
    );
    if (!servico) {
      throw new Error(
        "Serviço não encontrado ou não pertence a este prestador."
      );
    }

    // Buscar cliente se clienteId informado (via repositório) com validação de pertencimento
    let cliente: { id: string } | null = null;
    if (dto.clienteId) {
      const c = await clientRepository.findByIdAndPrestadorId(
        dto.clienteId,
        prestadorId
      );
      if (!c) {
        throw new Error(
          "Cliente não encontrado ou não pertence a este prestador."
        );
      }
      cliente = c;

      // Verificação de pendência: se o cliente estiver marcado com pendencia,
      // retornamos um objeto sinalizando que é necessária confirmação no front-end.
      // Se for enviada a flag forceCreate, ignoramos a pendencia e prosseguimos.
      if ((c as any).pendencia && !dto.forceCreate) {
        // Construir resumo das pendências para o front-end
        const baseWhere = {
          cliente_id: c.id,
          status_pagamento: "pendente",
        } as any;

        const totalCount = await prisma.agendamentos.count({
          where: baseWhere,
        });

        const pendingList = await prisma.agendamentos.findMany({
          where: baseWhere,
          select: {
            id: true,
            valor_final: true,
            scheduled_start_at: true,
            servico: { select: { id: true, nome: true } },
          },
          orderBy: { scheduled_start_at: "asc" },
          take: 10,
        });

        let total = 0;
        const items = pendingList.map((p: any) => {
          const valAny: any = p.valor_final;
          const valor =
            valAny && typeof valAny.toNumber === "function"
              ? valAny.toNumber()
              : Number(valAny) || 0;
          total += valor;
          return {
            id: p.id,
            valor,
            servicoNome: p.servico?.nome,
            data: p.scheduled_start_at,
          };
        });

        return {
          needsConfirmation: true,
          client: c,
          pendingSummary: {
            count: totalCount,
            total,
            items,
          },
        } as any;
      }
    }

    // Calcular positionKey para inserção no fim da lista do dia
    const lastKey = await appointmentRepository.getLastPositionKeyForDay(
      prestadorId,
      dataAgendada
    );
    const positionKey = LexicalReorderUtility.getNewKey(lastKey, null);

    // Monta payload evitando passar undefined em exactOptionalPropertyTypes
    const createPayload: {
      prestadorId: string;
      servicoId: string;
      dataAgendada: Date;
      paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
      positionKey: string;
      clienteId?: string;
    } = {
      prestadorId,
      servicoId: servico.id,
      dataAgendada,
      paymentStatus: dto.paymentStatus ?? "unpaid",
      positionKey,
    };
    if (cliente) createPayload.clienteId = cliente.id;
    const created = await appointmentRepository.create(createPayload);

    // Registrar auditoria
    await auditLogRepository.register({
      prestadorId,
      entidade: "Agendamento",
      agendamentoId: created.id,
      action: "CRIACAO" as AuditActionEnum,
      after: {
        id: created.id,
        status: created.status,
        data_agendada: created.data_agendada,
      },
      metadata: { data_agendada: dto.dataAgendada },
    });

    // Se solicitado, marcar como pago imediatamente e sincronizar pendencia
    if (dto.markAsPaid) {
      try {
        // Atualiza o status de pagamento do agendamento
        // Nota: NÃO sincronizamos automaticamente a flag 'pendencia' aqui para preservar o comportamento manual/alerta.
        await updatePaymentStatusService.execute(
          prestadorId,
          created.id,
          "pago"
        );
      } catch (err) {
        // Não falhar a criação por conta de problema na atualização de pagamento
      }
    }

    return created;
  }
}

export const createAppointmentService = new CreateAppointmentService();
