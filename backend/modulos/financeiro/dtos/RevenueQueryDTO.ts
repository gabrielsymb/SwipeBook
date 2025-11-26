// DTO de entrada para a consulta de faturamento
export interface RevenueQueryDTO {
  startDate: string; // Data de início no formato 'YYYY-MM-DD'
  endDate: string; // Data de fim no formato 'YYYY-MM-DD'
  // Em projetos com `exactOptionalPropertyTypes` o optional pode ser undefined
  statusPagamento?: "pago" | "pendente" | "todos" | undefined; // Filtro de status (usado agora no detalhe)
  term?: string | undefined; // Termo de busca por nome de cliente ou serviço
}
