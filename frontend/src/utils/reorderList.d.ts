import type { Agendamento } from "../api/types";
/**
 * @description Reordena um array de objetos baseado em uma nova ordem de IDs.
 * @param list Lista original de objetos (ex: Agendamentos).
 * @param newOrderIds Novo array contendo APENAS os IDs na ordem desejada.
 * @returns Novo array de objetos reordenado.
 */
export declare const reorderList: (list: Agendamento[], newOrderIds: string[]) => Agendamento[];
