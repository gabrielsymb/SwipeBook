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
export declare const appointmentsApi: {
    listAppointments: () => Promise<Appointment[]>;
    reorderAppointments: (appointmentIds: string[]) => Promise<void>;
};
