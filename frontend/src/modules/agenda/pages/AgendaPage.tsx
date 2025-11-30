import { Box, Paper, Typography } from "@mui/material";
import React from "react";

export const AgendaPage: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#333" }}
      >
        Agenda de Hoje
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Bem-vindo! Aqui você verá a lista de agendamentos e poderá
        iniciá-los/pausá-los.
      </Typography>

      {/* TODO: Futuramente, o componente de lista de agendamentos virá aqui */}
      <Box
        sx={{
          mt: 4,
          height: "400px",
          border: "1px dashed #ccc",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          [Placeholder para o Calendário e a Lista de Agendamentos]
        </Typography>
      </Box>
    </Paper>
  );
};
