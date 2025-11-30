import { api } from "../services/api";

// Interface para dados vindos da API (com scheduled_start_at como string)
interface AppointmentResponse {
  id: string;
  client_name: string;
  service_name: string;
  scheduled_start_at: string;
  duration_minutes: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  position_key?: string;
}

// Interface para uso no frontend (com scheduled_start_at como Date)
export interface Appointment {
  id: string;
  client_name: string;
  service_name: string;
  scheduled_start_at: Date;
  duration_minutes: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  position_key?: string;
}

export const appointmentsApi = {
  listAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<AppointmentResponse[]>("/agendamentos");
    return response.data.map((item: AppointmentResponse) => ({
      ...item,
      scheduled_start_at: new Date(item.scheduled_start_at),
    }));
  },

  reorderAppointments: async (appointmentIds: string[]): Promise<void> => {
    await api.put("/agendamentos/reorder", { appointmentIds });
  },
};
