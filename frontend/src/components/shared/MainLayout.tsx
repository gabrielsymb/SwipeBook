import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import React from "react";
import { useAuthStore } from "../../store/AuthStore";
import { DockPlayer } from "../DockPlayer/DockPlayer";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logout } = useAuthStore();

  // Logout com confirmação
  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      logout();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 1. Navbar/Header usando paleta neutra */}
      <AppBar position="static" sx={{ bgcolor: "#333333" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SwipeBook - Agenda
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogOut size={20} />}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. Conteúdo da Página Atual */}
      <Box
        component="main"
        sx={{
          p: 3,
          minHeight: "calc(100vh - 64px - 60px)",
          bgcolor: "#f5f5f5",
        }}
      >
        {children}
      </Box>

      {/* 3. Dock Player Fixo */}
      <DockPlayer />
    </Box>
  );
};
