// frontend/src/modules/agenda/hooks/useFetchAppointments.ts
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { agendaApi } from "../../../api/agenda";
// Chave única para o módulo de Agenda
const AGENDA_QUERY_KEY = "appointments";
/**
 * @description Hook customizado para buscar e gerenciar o cache dos agendamentos de um dia específico.
 * @param date O objeto Date para buscar os agendamentos.
 */
export function useFetchAppointments(date) {
    // 1. Formata o objeto Date para a string YYYY-MM-DD exigida pelo Backend
    const formattedDate = format(date, "yyyy-MM-dd");
    const query = useQuery({
        queryKey: [AGENDA_QUERY_KEY, formattedDate],
        queryFn: () => agendaApi.fetchAppointmentsByDate(formattedDate),
        // Configurações de Cache (Boas práticas para UX)
        staleTime: 1000 * 60, // 1 minuto
        placeholderData: (previousData) => previousData, // Substitui keepPreviousData
    });
    return query;
}
