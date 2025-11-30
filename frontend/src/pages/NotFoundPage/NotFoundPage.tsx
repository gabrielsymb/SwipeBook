import { Box, Typography } from "@mui/material";

/**
 * @description Página 404 - Não encontrada
 */
export function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 3,
      }}
    >
      <Typography variant="h1" component="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        A página que você está procurando não existe ou foi removida.
      </Typography>
    </Box>
  );
}
