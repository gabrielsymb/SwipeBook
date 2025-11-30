import { create } from "zustand";
export const useAuthStore = create((set) => ({
    token: null,
    prestador: null,
    isLoggedIn: false,
    isAuthenticated: false, // Alias para isLoggedIn
    login: (token, prestador) => {
        localStorage.setItem("swipebook_token", token);
        set({ token, prestador, isLoggedIn: true, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem("swipebook_token");
        set({
            token: null,
            prestador: null,
            isLoggedIn: false,
            isAuthenticated: false,
        });
    },
    checkAuth: () => {
        const storedToken = localStorage.getItem("swipebook_token");
        if (storedToken) {
            const mockPrestador = {
                id: "mock-id-123",
                nome: "Prestador Mock",
            };
            set({
                token: storedToken,
                prestador: mockPrestador,
                isLoggedIn: true,
                isAuthenticated: true,
            });
        }
    },
}));
