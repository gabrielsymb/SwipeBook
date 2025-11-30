import type { FC } from "react";
interface Appointment {
    id: string;
    client_name: string;
    service_name: string;
    scheduled_start_at: Date;
    duration_minutes: number;
    status: "scheduled" | "in_progress" | "completed" | "cancelled";
    notes?: string;
}
interface AppointmentListItemProps {
    appointment: Appointment;
}
export declare const AppointmentListItem: FC<AppointmentListItemProps>;
export {};
