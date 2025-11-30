import { api } from "../services/api";
export const appointmentsApi = {
    listAppointments: async () => {
        const response = await api.get("/agendamentos");
        return response.data.map((item) => ({
            ...item,
            scheduled_start_at: new Date(item.scheduled_start_at),
        }));
    },
    reorderAppointments: async (appointmentIds) => {
        await api.put("/agendamentos/reorder", { appointmentIds });
    },
};
