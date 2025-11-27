import { create } from "zustand";

interface Prestador {
  id: string;
  nome: string;
}

interface AuthState {
  token: string | null;
  prestador: Prestador | null;
  isLoggedIn: boolean;

  login: (token: string, prestador: Prestador) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  prestador: null,
  isLoggedIn: false,

  login: (token, prestador) => {
    localStorage.setItem("swipebook_token", token);
    set({ token, prestador, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("swipebook_token");
    set({ token: null, prestador: null, isLoggedIn: false });
  },

  checkAuth: () => {
    const storedToken = localStorage.getItem("swipebook_token");
    if (storedToken) {
      const mockPrestador: Prestador = {
        id: "mock-id-123",
        nome: "Prestador Mock",
      };
      set({ token: storedToken, prestador: mockPrestador, isLoggedIn: true });
    }
  },
}));
