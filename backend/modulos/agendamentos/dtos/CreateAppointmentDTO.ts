// DTO de criação de agendamento (entrada do controller)
export interface CreateAppointmentDTO {
  servicoId: string; // Serviço associado (obrigatório para duração/preço)
  clienteId?: string; // Cliente cadastrado (opcional se walk-in)
  walkInNome?: string; // Nome rápido se for atendimento avulso
  dataAgendada: string; // ISO string da data/hora agendada
  paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
}
