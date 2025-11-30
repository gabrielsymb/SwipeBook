// frontend/src/store/SessionStore.ts

import { create } from "zustand";
import type { Sessao, SessionStatus } from "../api/types";

// O estado interno gerenciado pelo Front-end para o timer
interface SessionState {
  // A sessão mais recente retornada do Backend (null se inativa)
  session: Sessao | null;

  // O tempo que será exibido na UI (em milissegundos)
  currentElapsedMs: number;

  // Para controle de quando o último tick do timer ocorreu (para calcular o delta)
  lastTickTimestamp: number | undefined;

  // Identificador do setInterval (o relógio JavaScript)
  intervalId: number | undefined;
}

// As ações que o DockPlayer pode executar
interface SessionActions {
  // Ações de gerenciamento de estado
  setActiveSession: (sessao: Sessao) => void;
  clearSession: () => void;
  updateStatus: (newStatus: SessionStatus) => void;

  // Ações do timer
  startLocalTimer: (initialElapsedMs: number) => void;
  stopLocalTimer: () => void;

  // Ação principal do relógio (chamada pelo setInterval)
  tick: () => void;
}

export const useSessionStore = create<SessionState & SessionActions>(
  (set, get) => ({
    // --- Estado Inicial ---
    session: null,
    currentElapsedMs: 0,
    lastTickTimestamp: undefined,
    intervalId: undefined,

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

    clearSession: () =>
      set({
        session: null,
        currentElapsedMs: 0,
        lastTickTimestamp: undefined,
      }),

    updateStatus: (newStatus) => {
      const currentSession = get().session;
      if (currentSession) {
        set({ session: { ...currentSession, status: newStatus } });

        if (newStatus === "active") {
          get().startLocalTimer(get().currentElapsedMs);
        } else {
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
      }, 1000) as unknown as number; // Tick a cada segundo

      set({
        intervalId: id,
        lastTickTimestamp: Date.now(),
        currentElapsedMs: initialElapsedMs,
      });
    },

    stopLocalTimer: () => {
      if (get().intervalId != null) {
        clearInterval(get().intervalId);
        set({ intervalId: undefined, lastTickTimestamp: undefined });
      }
    },

    tick: () => {
      // Esta é a função principal que é chamada a cada segundo
      set((state) => {
        if (
          state.session?.status !== "active" ||
          state.lastTickTimestamp == null
        ) {
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
  })
);
