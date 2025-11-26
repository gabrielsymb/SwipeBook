// DTO de criação de agendamento.
// Observações:
// - dataAgendada deve vir como string ISO (UTC ou com timezone) e será convertida para Date no service.
// - walkInNome usado se clienteId não for fornecido (futuro: validação específica).
export interface CreateAppointmentDTO {
  servicoId: string;
  clienteId?: string;
  walkInNome?: string;
  dataAgendada: string; // ISO string
  paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
  // Se true, ignora a flag de pendência do cliente e cria o agendamento
  forceCreate?: boolean;
  // Se true e se o agendamento for criado, marcar como pago automaticamente
  markAsPaid?: boolean;
}
