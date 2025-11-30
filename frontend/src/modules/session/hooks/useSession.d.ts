import type { ApiErrorResponse, Sessao, StartSessionRequestDTO } from "../../../api/types";
/**
 * @description Hook para buscar a sessão ativa no Backend.
 * O resultado alimenta o estado global (Zustand).
 */
export declare function useActiveSessionQuery(options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Sessao | null, ApiErrorResponse>;
/**
 * @description Inicia uma nova sessão para um agendamento.
 */
export declare function useStartSession(): import("@tanstack/react-query").UseMutationResult<Sessao, ApiErrorResponse, StartSessionRequestDTO, unknown>;
/**
 * @description Pausa a sessão ativa.
 */
export declare function usePauseSession(): import("@tanstack/react-query").UseMutationResult<Sessao, ApiErrorResponse, string, unknown>;
/**
 * @description Retoma a sessão pausada.
 */
export declare function useResumeSession(): import("@tanstack/react-query").UseMutationResult<Sessao, ApiErrorResponse, string, unknown>;
/**
 * @description Finaliza a sessão, marcando o agendamento como 'done'.
 */
export declare function useStopSession(): import("@tanstack/react-query").UseMutationResult<Sessao, ApiErrorResponse, string, unknown>;
