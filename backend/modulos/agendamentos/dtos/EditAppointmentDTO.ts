// DTO para edição administrativa de campos complementares do agendamento (UC07)
export interface EditAppointmentDTO {
  servicoId?: string | null;
  clienteId?: string | null;
  paymentStatus?: "unpaid" | "paid" | "partial" | "refunded";
  // Versão atual do agendamento para controle de concorrência (obrigatório)
  version: number;
}
