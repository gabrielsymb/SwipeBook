// frontend/src/utils/reorderList.ts
import type { Agendamento } from "../api/types";

/**
 * @description Reordena um array de objetos baseado em uma nova ordem de IDs.
 * @param list Lista original de objetos (ex: Agendamentos).
 * @param newOrderIds Novo array contendo APENAS os IDs na ordem desejada.
 * @returns Novo array de objetos reordenado.
 */
export const reorderList = (
  list: Agendamento[],
  newOrderIds: string[]
): Agendamento[] => {
  // 1. Cria um mapa {id: objeto} para acesso rápido O(1)
  const map = new Map(list.map((item: Agendamento) => [item.id, item]));

  // 2. Mapeia a nova ordem de IDs de volta para os objetos, ignorando IDs ausentes (filter(Boolean))
  const newList = newOrderIds
    .map((id) => map.get(id))
    .filter((item): item is Agendamento => Boolean(item));

  return newList;
};
