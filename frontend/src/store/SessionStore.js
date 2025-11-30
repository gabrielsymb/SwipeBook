// frontend/src/store/SessionStore.ts
import { create } from "zustand";
export const useSessionStore = create((set, get) => ({
    // --- Estado Inicial ---
    session: null,
    currentElapsedMs: 0,
    lastTickTimestamp: null,
    intervalId: null,
    // --- Ações de Estado ---
    setActiveSession: (sessao) => {
        set({
            session: sessao,
            currentElapsedMs: Number(sessao.elapsed_ms),
        });
        // Inicia o timer local se o status for 'active'
        if (sessao.status === "active") {
            get().startLocalTimer(Number(sessao.elapsed_ms));
        }
    },
    clearSession: () => set({
        session: null,
        currentElapsedMs: 0,
        lastTickTimestamp: null,
    }),
    updateStatus: (newStatus) => {
        const currentSession = get().session;
        if (currentSession) {
            set({ session: { ...currentSession, status: newStatus } });
            if (newStatus === "active") {
                get().startLocalTimer(get().currentElapsedMs);
            }
            else {
                get().stopLocalTimer();
            }
        }
    },
    // --- Ações do Timer ---
    startLocalTimer: (initialElapsedMs) => {
        // Limpa qualquer timer anterior
        get().stopLocalTimer();
        // Inicia o contador
        const id = window.setInterval(() => {
            get().tick();
        }, 1000); // Tick a cada segundo
        set({
            intervalId: id,
            lastTickTimestamp: Date.now(),
            currentElapsedMs: initialElapsedMs,
        });
    },
    stopLocalTimer: () => {
        if (get().intervalId) {
            clearInterval(get().intervalId);
            set({ intervalId: null, lastTickTimestamp: null });
        }
    },
    tick: () => {
        // Esta é a função principal que é chamada a cada segundo
        set((state) => {
            if (state.session?.status !== "active" || !state.lastTickTimestamp) {
                get().stopLocalTimer(); // Garantir que para se o status mudou
                return state;
            }
            const now = Date.now();
            const deltaMs = now - state.lastTickTimestamp; // Diferença desde o último tick
            // NOVO TEMPO DECORRIDO
            const newElapsed = state.currentElapsedMs + deltaMs;
            // O Heartbeat (sincronização com o Backend) deve ser feito em outro local
            // (ex: a cada 10 ticks, ou a cada 30 segundos)
            return {
                currentElapsedMs: newElapsed,
                lastTickTimestamp: now,
            };
        });
    },
}));
