import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Calendar } from "lucide-react";
import type { Appointment } from "../../api/appointments";
import { AppointmentListItem } from "../../components/AppointmentListItem";
import {
  useAppointmentsQuery,
  useReorderAppointments,
} from "../../modules/appointments/hooks/useAppointmentsQuery";

export function AgendaPage() {
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useAppointmentsQuery();
  const reorderMutation = useReorderAppointments();

  // A lista de IDs é necessária para o SortableContext do DND Kit
  const items = appointments?.map((a: Appointment) => a.id) || [];

  // Função que será chamada quando o item for solto após o arrasto
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && appointments) {
      const oldIndex = appointments.findIndex(
        (item: Appointment) => item.id === active.id
      );
      const newIndex = appointments.findIndex(
        (item: Appointment) => item.id === over?.id
      );

      const reorderedAppointments = arrayMove(appointments, oldIndex, newIndex);
      const reorderedIds = reorderedAppointments.map(
        (appointment: Appointment) => appointment.id
      );

      // Dispara a mutação para reordenar no backend
      reorderMutation.mutate(reorderedIds);

      console.log(
        `Item ${active.id} movido da posição ${oldIndex} para ${newIndex}.`
      );
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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress sx={{ color: "#333333" }} />
        <Typography ml={2}>Carregando agenda...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 4, maxWidth: "900px", margin: "2rem auto" }}
      >
        <Typography>Erro ao carregar agendamentos: {error?.message}</Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            <Calendar
              size={32}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            Agenda de Hoje
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {today}
          </Typography>
        </Box>
      </Box>

      {/* Estatísticas do Dia */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {todayStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de Agendamentos
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="info.main">
              {todayStats.scheduled}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agendados
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="warning.main">
              {todayStats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Em Andamento
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" color="success.main">
              {todayStats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Concluídos
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Lista de Agendamentos
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          {appointments.length} agendamentos | Arraste os itens para reordenar
          por prioridade
        </Typography>

        {/* Componentes Principais do DND Kit */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Box sx={{ minHeight: "300px" }}>
              {appointments.map((appointment) => (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>

        {appointments.length === 0 && (
          <Alert severity="info" variant="outlined" sx={{ mt: 4 }}>
            <Typography>
              Você não tem agendamentos marcados para hoje.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
