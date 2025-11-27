/**
 * Formata milissegundos em formato de tempo legível (HH:MM:SS)
 * @param ms Milissegundos a serem formatados
 * @returns String no formato "HH:MM:SS"
 */
export function formatMsToTime(ms: number): string {
  // Garantir que o valor seja positivo
  const totalMs = Math.max(0, ms);

  // Converter para segundos totais
  const totalSeconds = Math.floor(totalMs / 1000);

  // Calcular horas, minutos e segundos
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Formatar com zero à esquerda quando necessário
  const formatWithZero = (num: number): string =>
    num.toString().padStart(2, "0");

  return `${formatWithZero(hours)}:${formatWithZero(minutes)}:${formatWithZero(
    seconds
  )}`;
}

/**
 * Converte segundos para milissegundos
 * @param seconds Segundos
 * @returns Milissegundos
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converte milissegundos para segundos
 * @param ms Milissegundos
 * @returns Segundos
 */
export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}
