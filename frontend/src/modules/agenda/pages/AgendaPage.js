import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
export const AgendaPage = () => {
    return (_jsxs(Paper, { elevation: 1, sx: { p: 4 }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, sx: { color: "#333" }, children: "Agenda de Hoje" }), _jsx(Typography, { variant: "body1", color: "text.secondary", children: "Bem-vindo! Aqui voc\u00EA ver\u00E1 a lista de agendamentos e poder\u00E1 inici\u00E1-los/paus\u00E1-los." }), _jsx(Box, { sx: {
                    mt: 4,
                    height: "400px",
                    border: "1px dashed #ccc",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    bgcolor: "#fafafa",
                }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "[Placeholder para o Calend\u00E1rio e a Lista de Agendamentos]" }) })] }));
};
