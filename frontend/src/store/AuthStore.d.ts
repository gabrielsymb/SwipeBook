interface Prestador {
    id: string;
    nome: string;
}
interface AuthState {
    token: string | null;
    prestador: Prestador | null;
    isLoggedIn: boolean;
    isAuthenticated: boolean;
    login: (token: string, prestador: Prestador) => void;
    logout: () => void;
    checkAuth: () => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
