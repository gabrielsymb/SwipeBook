// DTO para Reorder usando chaves lexicais
export interface ReorderAppointmentDTO {
  agendamentoId: string;
  prestadorId: string;
  keyBefore: string | null; // Chave do item anterior (null se inserir como primeiro)
  keyAfter: string | null; // Chave do item seguinte (null se inserir como último)
  dataAgendada: Date; // Contexto do dia (para auditoria/validações futuras)
}
