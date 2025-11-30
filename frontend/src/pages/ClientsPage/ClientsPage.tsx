import { Box, Typography } from "@mui/material";

/**
 * @description Página placeholder para gerenciamento de clientes
 */
export function ClientsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Clientes
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Esta é uma página protegida - somente usuários autenticados podem
        acessá-la.
      </Typography>
    </Box>
  );
}
