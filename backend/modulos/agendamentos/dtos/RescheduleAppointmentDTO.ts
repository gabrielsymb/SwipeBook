// DTO para operação de reagendamento.
// novoStartAt deve ser convertido para Date no controller antes de chegar no service.
export interface RescheduleAppointmentDTO {
  id: string; // Identificador do agendamento alvo
  novoStartAt: Date; // Nova data/hora já validada (Date)
  prestadorId: string; // Prestador para escopo de conflito e autorização
}
