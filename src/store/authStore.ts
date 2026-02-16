import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const getTokenFromStorage = (): string | null => {
  return sessionStorage.getItem('accessToken');
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getTokenFromStorage(),
  setToken: (token: string) => {
    sessionStorage.setItem('accessToken', token);
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem('accessToken');
    set({ token: null });
  },
}));

