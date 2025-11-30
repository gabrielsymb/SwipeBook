import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import React from "react";
import { useAuthStore } from "../../store/AuthStore";
import { DockPlayer } from "../DockPlayer/DockPlayer";
export const MainLayout = ({ children, }) => {
    const { logout } = useAuthStore();
    // Logout com confirmação
    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair?")) {
            logout();
        }
    };
    return (_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(AppBar, { position: "static", sx: { bgcolor: "#333333" }, children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: "SwipeBook - Agenda" }), _jsx(Button, { color: "inherit", onClick: handleLogout, startIcon: _jsx(LogOut, { size: 20 }), children: "Sair" })] }) }), _jsx(Box, { component: "main", sx: {
                    p: 3,
                    minHeight: "calc(100vh - 64px - 60px)",
                    bgcolor: "#f5f5f5",
                }, children: children }), _jsx(DockPlayer, {})] }));
};
