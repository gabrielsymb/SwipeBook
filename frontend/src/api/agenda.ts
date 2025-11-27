// frontend/src/api/agenda.ts

import { api } from "../services/api";
import type { Agendamento, ReorderAppointmentRequestDTO } from "./types";

export const agendaApi = {
  /**
   * @description Busca a lista de agendamentos para uma data específica.
   * Rota: GET /agendamentos?date=YYYY-MM-DD
   * @param dateString A data no formato 'YYYY-MM-DD'.
   */
  async fetchAppointmentsByDate(dateString: string): Promise<Agendamento[]> {
    const response = await api.get<Agendamento[]>(`/agendamentos`, {
      params: {
        date: dateString,
      },
    });
    return response.data;
  },
  /**
   * @description Envia a nova posição lógica (vizinhos) para o Backend reordenar.
   * Rota: PATCH /agendamentos/:id/reorder
   */
  async reorderAppointment(
    id: string,
    data: ReorderAppointmentRequestDTO
  ): Promise<void> {
    await api.patch(`/agendamentos/${id}/reorder`, data);
  },
  // Futuramente: create, update, cancel, etc.
};
