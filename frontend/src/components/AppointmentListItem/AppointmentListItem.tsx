import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Clock, GripVertical } from "lucide-react";
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

export const AppointmentListItem: FC<AppointmentListItemProps> = ({
  appointment,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: appointment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const startTime = format(appointment.scheduled_start_at, "HH:mm", {
    locale: ptBR,
  });
  const endTime = format(
    new Date(
      appointment.scheduled_start_at.getTime() +
        appointment.duration_minutes * 60000
    ),
    "HH:mm",
    { locale: ptBR }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: isDragging ? 4 : 1,
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <GripVertical size={16} />
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: statusColors[appointment.status],
            }}
          >
            {appointment.client_name.charAt(0).toUpperCase()}
          </Avatar>

          {/* Main Content */}
          <Box flex={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 600 }}
                >
                  {appointment.client_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {appointment.service_name}
                </Typography>

                {appointment.notes && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    {appointment.notes}
                  </Typography>
                )}
              </Box>

              {/* Time and Status */}
              <Box textAlign="right">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ mb: 1 }}
                >
                  <Clock size={14} style={{ marginRight: 4 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {startTime} - {endTime}
                  </Typography>
                </Box>

                <Chip
                  label={statusLabels[appointment.status]}
                  size="small"
                  sx={{
                    bgcolor: statusColors[appointment.status],
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
