import type { Agendamento } from "../../../api/types";
/**
 * @description Hook customizado para buscar e gerenciar o cache dos agendamentos de um dia específico.
 * @param date O objeto Date para buscar os agendamentos.
 */
export declare function useFetchAppointments(date: Date): import("@tanstack/react-query").UseQueryResult<Agendamento[], Error>;
