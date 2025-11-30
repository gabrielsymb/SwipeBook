import type { Sessao, SessionStatus } from "../api/types";
interface SessionState {
    session: Sessao | null;
    currentElapsedMs: number;
    lastTickTimestamp: number | null;
    intervalId: number | null;
}
interface SessionActions {
    setActiveSession: (sessao: Sessao) => void;
    clearSession: () => void;
    updateStatus: (newStatus: SessionStatus) => void;
    startLocalTimer: (initialElapsedMs: number) => void;
    stopLocalTimer: () => void;
    tick: () => void;
}
export declare const useSessionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SessionState & SessionActions>>;
export {};
