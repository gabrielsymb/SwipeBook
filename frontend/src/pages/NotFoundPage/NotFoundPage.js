import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from "@mui/material";
/**
 * @description Página 404 - Não encontrada
 */
export function NotFoundPage() {
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            p: 3,
        }, children: [_jsx(Typography, { variant: "h1", component: "h1", color: "error", gutterBottom: true, children: "404" }), _jsx(Typography, { variant: "h4", component: "h2", gutterBottom: true, children: "P\u00E1gina n\u00E3o encontrada" }), _jsx(Typography, { variant: "body1", color: "text.secondary", textAlign: "center", children: "A p\u00E1gina que voc\u00EA est\u00E1 procurando n\u00E3o existe ou foi removida." })] }));
}
