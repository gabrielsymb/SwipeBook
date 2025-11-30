import { type Appointment } from "../../../api/appointments";
export declare const APPOINTMENTS_QUERY_KEY: string[];
/**
 * Hook para buscar e gerenciar a lista de agendamentos
 */
export declare function useAppointmentsQuery(): import("@tanstack/react-query").UseQueryResult<Appointment[], Error>;
/**
 * Hook para reordenar agendamentos
 */
export declare function useReorderAppointments(): import("@tanstack/react-query").UseMutationResult<void, Error, string[], unknown>;
