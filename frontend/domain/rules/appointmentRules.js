// Regras de UI (espelho) - NÃO é fonte de verdade
// A regra verdadeira mora no backend (Services)
export function ensureNotPastDate(dateLike) {
  const date = new Date(dateLike);
  const now = new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error('Data inválida');
  }
  if (date < now.setHours(0, 0, 0, 0)) {
    throw new Error('Não pode agendar no passado');
  }
}
