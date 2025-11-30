// frontend/src/modules/agenda/hooks/useReorderAppointment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { agendaApi } from "../../../api/agenda";
import { reorderList } from "../../../utils/reorderList";
// Chave única para o módulo de Agenda
const AGENDA_QUERY_KEY = "appointments";
/**
 * @description Hook customizado para gerenciar a reordenação de agendamentos com Atualização Otimista.
 */
export function useReorderAppointment() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        // 1. Executa a chamada real para o Backend
        mutationFn: (payload) => {
            // Envia apenas o que o Backend precisa
            return agendaApi.reorderAppointment(payload.movedId, {
                previousAppointmentId: payload.previousAppointmentId,
                nextAppointmentId: payload.nextAppointmentId,
            });
        },
        // 2. Lógica Otimista: Aplicada antes da chamada à API
        onMutate: async (payload) => {
            const formattedDate = format(payload.date, "yyyy-MM-dd");
            const queryKey = [AGENDA_QUERY_KEY, formattedDate];
            // A. Cancela quaisquer re-fetches em andamento (para evitar que dados velhos sobrescrevam)
            await queryClient.cancelQueries({ queryKey });
            // B. Captura o estado anterior (snapshot) para rollback em caso de falha
            const previousAppointments = queryClient.getQueryData(queryKey);
            // C. Atualiza o cache localmente (Optimistic Update)
            if (previousAppointments) {
                const newList = reorderList(previousAppointments, payload.newOrderIds);
                // Aplica o novo estado ao cache (UI é atualizada INSTANTANEAMENTE)
                queryClient.setQueryData(queryKey, newList);
            }
            // Retorna o snapshot para o 'onError' usar no rollback
            return { previousAppointments };
        },
        // 3. Rollback: Se a chamada falhar (por ex., 500 Server Error)
        onError: (_err, payload, context) => {
            // Reverte o cache para o estado anterior
            if (context?.previousAppointments) {
                const formattedDate = format(payload.date, "yyyy-MM-dd");
                queryClient.setQueryData([AGENDA_QUERY_KEY, formattedDate], context.previousAppointments);
            }
            // TODO: Lógica de Toast/Erro aqui (ex: 'Não foi possível reordenar. Tente novamente.')
        },
        // 4. Sincronização: Chamado após sucesso ou falha para garantir a consistência
        onSettled: (_data, error, payload) => {
            const formattedDate = format(payload.date, "yyyy-MM-dd");
            // Invalida o cache para forçar um re-fetch em segundo plano
            queryClient.invalidateQueries({
                queryKey: [AGENDA_QUERY_KEY, formattedDate],
            });
            if (!error) {
                // TODO: Lógica de Toast/Sucesso aqui (se necessário)
            }
        },
    });
    return mutation;
}
