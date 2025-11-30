import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { Clock, Pause, Play, StopCircle } from "lucide-react";
import { usePauseSession, useResumeSession, useStopSession, } from "../../modules/session/hooks/useSession";
import { useSessionStore } from "../../store/SessionStore";
import { formatMsToTime } from "../../utils/timeFormatter.js";
/**
 * @description DockPlayer: Timer de sessão ativo/pausado usando MUI com paleta neutra.
 */
export function DockPlayer() {
    const { session, currentElapsedMs, clearSession } = useSessionStore();
    const stopMutation = useStopSession();
    const pauseMutation = usePauseSession();
    const resumeMutation = useResumeSession();
    if (!session || session.status === "stopped") {
        if (session)
            clearSession(); // Limpa se foi parado
        return null;
    }
    const { id: sessionId, agendamento_id, status } = session;
    const isPlaying = status === "active";
    const isLoading = pauseMutation.isPending ||
        resumeMutation.isPending ||
        stopMutation.isPending;
    // A cor de destaque (verde ou laranja) será usada no ícone/borda
    const statusColor = isPlaying ? "#2ecc71" : "#f39c12"; // Verde (Ativo) ou Laranja (Pausado)
    const handlePauseResume = () => {
        if (isPlaying) {
            pauseMutation.mutate(sessionId);
        }
        else {
            resumeMutation.mutate(sessionId);
        }
    };
    const handleStop = () => {
        if (window.confirm("Tem certeza que deseja finalizar a sessão? O tempo será gravado e o agendamento concluído.")) {
            stopMutation.mutate(sessionId);
        }
    };
    const formattedTime = formatMsToTime(currentElapsedMs);
    return (_jsx(Paper // Usando Paper para elevação (sombra) e cor de fundo
    , { elevation: 10, sx: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            // Paleta Neutra: Fundo escuro/cinza e cor de texto clara
            bgcolor: "#333333", // Cinza escuro
            color: "white",
            zIndex: 1000,
            padding: 1.5,
            borderTop: `4px solid ${statusColor}`, // Borda colorida como indicador principal
            borderRadius: 0, // Remove o arredondamento padrão do Paper
        }, children: _jsxs(Box, { sx: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: "1200px", // Limite de largura para desktop
                margin: "0 auto",
            }, children: [_jsxs(Box, { sx: { flexGrow: 1, minWidth: "100px" }, children: [_jsxs(Typography, { variant: "body2", sx: { fontWeight: "bold", lineHeight: 1, color: "white" }, children: [_jsx(Clock, { size: 16, style: { verticalAlign: "middle", marginRight: 5 } }), "Sess\u00E3o #", agendamento_id?.substring(0, 4) ?? ""] }), _jsx(Typography, { variant: "caption", sx: { lineHeight: 1, color: "#aaa" }, children: isPlaying ? "EM ANDAMENTO" : "PAUSADA" })] }), _jsx(Typography, { variant: "h4", sx: {
                        fontWeight: "bold",
                        margin: "0 20px",
                        fontFamily: "monospace",
                        color: "white",
                    }, children: formattedTime }), _jsxs(Box, { sx: { display: "flex", gap: 1 }, children: [_jsx(IconButton, { onClick: handlePauseResume, disabled: isLoading, sx: {
                                color: isPlaying ? statusColor : "white", // Ícone ativo na cor de status
                                bgcolor: "rgba(255,255,255,0.1)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                            }, children: isPlaying ? _jsx(Pause, { size: 24 }) : _jsx(Play, { size: 24 }) }), _jsx(IconButton, { onClick: handleStop, disabled: isLoading, sx: {
                                color: "#e74c3c", // Vermelho fixo para "Stop" (Perigo)
                                bgcolor: "rgba(255,255,255,0.1)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                            }, children: _jsx(StopCircle, { size: 24 }) })] })] }) }));
}
