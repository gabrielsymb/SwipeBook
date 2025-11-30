import type { Agendamento, ApiErrorResponse, ReorderAppointmentRequestDTO } from "../../../api/types";
/**
 * Payload de entrada para o useMutation: Contém os dados de UI e de API.
 */
interface ReorderMutationPayload extends ReorderAppointmentRequestDTO {
    movedId: string;
    date: Date;
    newOrderIds: string[];
}
/**
 * @description Hook customizado para gerenciar a reordenação de agendamentos com Atualização Otimista.
 */
export declare function useReorderAppointment(): import("@tanstack/react-query").UseMutationResult<void, ApiErrorResponse, ReorderMutationPayload, {
    previousAppointments: Agendamento[] | undefined;
}>;
export {};
