// frontend/src/modules/session/hooks/useSession.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { sessionApi } from "../../../api/session";
import { useSessionStore } from "../../../store/SessionStore";
// Chaves de cache
const SESSION_QUERY_KEY = "activeSession";
const AGENDA_QUERY_KEY = "appointments"; // Usada para invalidar o agendamento após START/STOP
// ------------------------------------------------------------------
// QUERY: Carregamento da Sessão Ativa (Executado no App Load)
// ------------------------------------------------------------------
/**
 * @description Hook para buscar a sessão ativa no Backend.
 * O resultado alimenta o estado global (Zustand).
 */
export function useActiveSessionQuery(options = {}) {
    const { setActiveSession } = useSessionStore();
    const { enabled = true } = options;
    const query = useQuery({
        queryKey: [SESSION_QUERY_KEY],
        queryFn: sessionApi.fetchActiveSession,
        enabled, // Adiciona controle condicional
        // Configurações: O estado da sessão é crucial, não deve ser considerado 'velho'.
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
    // Reage aos dados quando eles mudarem (substitui o onSuccess)
    useEffect(() => {
        if (query.data) {
            // Se houver sessão, salva no Zustand (iniciando o timer local se status='active')
            setActiveSession(query.data);
        }
    }, [query.data, setActiveSession]);
    return query;
}
// ------------------------------------------------------------------
// MUTAÇÃO: Iniciar Sessão (START)
// ------------------------------------------------------------------
/**
 * @description Inicia uma nova sessão para um agendamento.
 */
export function useStartSession() {
    const queryClient = useQueryClient();
    const { setActiveSession } = useSessionStore();
    return useMutation({
        mutationFn: (data) => sessionApi.startSession(data),
        onSuccess: (data) => {
            // 1. Salva a sessão no estado global e inicia o timer
            setActiveSession(data);
            // 2. Invalida o cache para forçar a atualização:
            queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
            // ... e do agendamento (que agora terá status 'in_progress')
            queryClient.invalidateQueries({ queryKey: [AGENDA_QUERY_KEY] });
            console.log("Sessão iniciada com sucesso.");
        },
        onError: (error) => {
            // TODO: Mostrar Toast/Alerta de erro
            console.error("Erro ao iniciar sessão:", error);
        },
    });
}
// ------------------------------------------------------------------
// MUTAÇÃO: Pausar Sessão (PAUSE)
// ------------------------------------------------------------------
/**
 * @description Pausa a sessão ativa.
 */
export function usePauseSession() {
    const queryClient = useQueryClient();
    const { updateStatus } = useSessionStore();
    return useMutation({
        // string é o sessionId
        mutationFn: (sessionId) => sessionApi.pauseSession(sessionId),
        onSuccess: () => {
            // A API de pausa garante que o elapsed_ms foi persistido.
            // Atualizamos o status localmente (o Zustand pausa o timer).
            updateStatus("paused");
            queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
        },
    });
}
// ------------------------------------------------------------------
// MUTAÇÃO: Retomar Sessão (RESUME)
// ------------------------------------------------------------------
/**
 * @description Retoma a sessão pausada.
 */
export function useResumeSession() {
    const queryClient = useQueryClient();
    const { updateStatus } = useSessionStore();
    return useMutation({
        // string é o sessionId
        mutationFn: (sessionId) => sessionApi.resumeSession(sessionId),
        onSuccess: () => {
            // Atualiza o status localmente (o Zustand inicia o timer).
            updateStatus("active");
            queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
        },
    });
}
// ------------------------------------------------------------------
// MUTAÇÃO: Finalizar Sessão (STOP)
// ------------------------------------------------------------------
/**
 * @description Finaliza a sessão, marcando o agendamento como 'done'.
 */
export function useStopSession() {
    const queryClient = useQueryClient();
    const { clearSession } = useSessionStore();
    return useMutation({
        // string é o sessionId
        mutationFn: (sessionId) => sessionApi.stopSession(sessionId),
        onSuccess: () => {
            // 1. Limpa o estado global, parando o timer e zerando a UI do DockPlayer
            clearSession();
            // 2. Invalida o cache (a sessão some do cache, o agendamento muda para 'done')
            queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [AGENDA_QUERY_KEY] });
            console.log("Sessão finalizada com sucesso. Agendamento concluído.");
        },
        onError: (error) => {
            // TODO: Mostrar Toast/Alerta de erro
            console.error("Erro ao finalizar sessão:", error);
        },
    });
}
