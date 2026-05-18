import { create } from 'zustand';

interface User {
  id_usuario: number;
  tenant_id: number;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'professor' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id_usuario: 1,
    tenant_id: 1,
    nome: 'Usuário Admin',
    email: 'admin@virtulearning.com',
    tipo_usuario: 'admin'
  },
  token: 'mock-token',
  isAuthenticated: true,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
