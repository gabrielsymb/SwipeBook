import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Box, Card, CardContent, Chip, Typography, } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Clock, GripVertical } from "lucide-react";
const statusColors = {
    scheduled: "#2196F3",
    in_progress: "#FF9800",
    completed: "#4CAF50",
    cancelled: "#F44336",
};
const statusLabels = {
    scheduled: "Agendado",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
};
export const AppointmentListItem = ({ appointment, }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: appointment.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    const startTime = format(appointment.scheduled_start_at, "HH:mm", {
        locale: ptBR,
    });
    const endTime = format(new Date(appointment.scheduled_start_at.getTime() +
        appointment.duration_minutes * 60000), "HH:mm", { locale: ptBR });
    return (_jsx(Card, { ref: setNodeRef, style: style, sx: {
            mb: 2,
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: isDragging ? 4 : 1,
            "&:hover": {
                boxShadow: 3,
            },
        }, children: _jsx(CardContent, { sx: { p: 2 }, children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 2, children: [_jsx(Box, { ...attributes, ...listeners, sx: {
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                            "&:active": {
                                cursor: "grabbing",
                            },
                        }, children: _jsx(GripVertical, { size: 16 }) }), _jsx(Avatar, { sx: {
                            width: 40,
                            height: 40,
                            bgcolor: statusColors[appointment.status],
                        }, children: appointment.client_name.charAt(0).toUpperCase() }), _jsx(Box, { flex: 1, children: _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "start", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { fontWeight: 600 }, children: appointment.client_name }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: appointment.service_name }), appointment.notes && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { fontStyle: "italic" }, children: appointment.notes }))] }), _jsxs(Box, { textAlign: "right", children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "flex-end", sx: { mb: 1 }, children: [_jsx(Clock, { size: 14, style: { marginRight: 4 } }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: [startTime, " - ", endTime] })] }), _jsx(Chip, { label: statusLabels[appointment.status], size: "small", sx: {
                                                bgcolor: statusColors[appointment.status],
                                                color: "white",
                                                fontSize: "0.75rem",
                                            } })] })] }) })] }) }) }));
};
