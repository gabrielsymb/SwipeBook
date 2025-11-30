import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, type Appointment } from "../../../api/appointments";

export const APPOINTMENTS_QUERY_KEY = ["appointments"];

/**
 * Hook para buscar e gerenciar a lista de agendamentos
 */
export function useAppointmentsQuery() {
  return useQuery<Appointment[]>({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: () => appointmentsApi.listAppointments(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para reordenar agendamentos
 */
export function useReorderAppointments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentIds: string[]) =>
      appointmentsApi.reorderAppointments(appointmentIds),
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
