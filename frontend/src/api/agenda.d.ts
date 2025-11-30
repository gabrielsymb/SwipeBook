import type { Agendamento, ReorderAppointmentRequestDTO } from "./types";
export declare const agendaApi: {
    /**
     * @description Busca a lista de agendamentos para uma data específica.
     * Rota: GET /agendamentos?date=YYYY-MM-DD
     * @param dateString A data no formato 'YYYY-MM-DD'.
     */
    fetchAppointmentsByDate(dateString: string): Promise<Agendamento[]>;
    /**
     * @description Envia a nova posição lógica (vizinhos) para o Backend reordenar.
     * Rota: PATCH /agendamentos/:id/reorder
     */
    reorderAppointment(id: string, data: ReorderAppointmentRequestDTO): Promise<void>;
};
