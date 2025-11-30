import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { Alert, Box, CircularProgress, Grid, Paper, Typography, } from "@mui/material";
import { Calendar } from "lucide-react";
import { AppointmentListItem } from "../../components/AppointmentListItem";
import { useAppointmentsQuery, useReorderAppointments, } from "../../modules/appointments/hooks/useAppointmentsQuery";
export function AgendaPage() {
    const { data: appointments = [], isLoading, isError, error, } = useAppointmentsQuery();
    const reorderMutation = useReorderAppointments();
    // A lista de IDs é necessária para o SortableContext do DND Kit
    const items = appointments?.map((a) => a.id) || [];
    // Função que será chamada quando o item for solto após o arrasto
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id && appointments) {
            const oldIndex = appointments.findIndex((item) => item.id === active.id);
            const newIndex = appointments.findIndex((item) => item.id === over?.id);
            const reorderedAppointments = arrayMove(appointments, oldIndex, newIndex);
            const reorderedIds = reorderedAppointments.map((appointment) => appointment.id);
            // Dispara a mutação para reordenar no backend
            reorderMutation.mutate(reorderedIds);
            console.log(`Item ${active.id} movido da posição ${oldIndex} para ${newIndex}.`);
        }
    };
    // Estatísticas do dia
    const todayStats = {
        total: appointments.length,
        completed: appointments.filter((a) => a.status === "completed").length,
        active: appointments.filter((a) => a.status === "in_progress").length,
        scheduled: appointments.filter((a) => a.status === "scheduled").length,
    };
    const today = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    if (isLoading) {
        return (_jsxs(Box, { sx: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
            }, children: [_jsx(CircularProgress, { sx: { color: "#333333" } }), _jsx(Typography, { ml: 2, children: "Carregando agenda..." })] }));
    }
    if (isError) {
        return (_jsx(Alert, { severity: "error", sx: { mt: 4, maxWidth: "900px", margin: "2rem auto" }, children: _jsxs(Typography, { children: ["Erro ao carregar agendamentos: ", error?.message] }) }));
    }
    return (_jsxs(Box, { sx: { p: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "0 auto" }, children: [_jsx(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: _jsxs(Box, { children: [_jsxs(Typography, { variant: "h4", component: "h1", gutterBottom: true, sx: { fontWeight: "bold", color: "#333" }, children: [_jsx(Calendar, { size: 32, style: { verticalAlign: "middle", marginRight: 8 } }), "Agenda de Hoje"] }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: today })] }) }), _jsxs(Grid, { container: true, spacing: 2, mb: 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 1, sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "primary", children: todayStats.total }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total de Agendamentos" })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 1, sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "info.main", children: todayStats.scheduled }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Agendados" })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 1, sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "warning.main", children: todayStats.active }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Em Andamento" })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { elevation: 1, sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "success.main", children: todayStats.completed }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Conclu\u00EDdos" })] }) })] }), _jsxs(Paper, { elevation: 1, sx: { p: { xs: 2, md: 3 } }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, sx: { fontWeight: 600, mb: 2 }, children: "Lista de Agendamentos" }), _jsxs(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, sx: { mb: 3 }, children: [appointments.length, " agendamentos | Arraste os itens para reordenar por prioridade"] }), _jsx(DndContext, { collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: items, strategy: verticalListSortingStrategy, children: _jsx(Box, { sx: { minHeight: "300px" }, children: appointments.map((appointment) => (_jsx(AppointmentListItem, { appointment: appointment }, appointment.id))) }) }) }), appointments.length === 0 && (_jsx(Alert, { severity: "info", variant: "outlined", sx: { mt: 4 }, children: _jsx(Typography, { children: "Voc\u00EA n\u00E3o tem agendamentos marcados para hoje." }) }))] })] }));
}
