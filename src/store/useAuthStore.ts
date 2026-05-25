import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

export interface AuthUser {
  id: number;
  tenant_id: number;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'professor' | 'admin';
  avatar_url?: string | null;
  bio?: string | null;
  nickname?: string | null;
  telefone?: string | null;
  linkedin_url?: string | null;
}

export type ViewMode = 'aluno' | 'professor' | 'admin';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  viewMode: ViewMode;
  setAuth: (user: AuthUser, token: string) => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setViewMode: (mode: ViewMode) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: true,
      viewMode: 'aluno',

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, isInitializing: false, viewMode: user.tipo_usuario }),

      setToken: (token) => set({ token }),

      setUser: (user) => set({ user }),

      setViewMode: (mode) => set({ viewMode: mode }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false, viewMode: 'aluno' }),

      initAuth: async () => {
        const { token, viewMode } = get();
        if (!token) {
          set({ isInitializing: false });
          return;
        }
        try {
          const res = await api.get('/auth/me');
          const user: AuthUser = {
            id: res.data.user.id,
            tenant_id: res.data.user.tenant_id,
            nome: res.data.user.nome,
            email: res.data.user.email,
            tipo_usuario: res.data.user.tipo_usuario,
            avatar_url: res.data.user.avatar_url,
            bio: res.data.user.bio,
            nickname: res.data.user.nickname,
            telefone: res.data.user.telefone,
            linkedin_url: res.data.user.linkedin_url,
          };
          // Se o usuário já tiver um viewMode salvo e ele ainda for válido para o seu tipo (ou seja, se for admin pode ser qualquer um, professor pode ser prof/aluno), mantém.
          // Para simplificar, na inicialização já puxamos do storage. Se for inválido, cai pro tipo dele.
          let resolvedViewMode = viewMode;
          if (user.tipo_usuario === 'aluno' && viewMode !== 'aluno') resolvedViewMode = 'aluno';
          if (user.tipo_usuario === 'professor' && viewMode === 'admin') resolvedViewMode = 'professor';
          
          set({ user, isAuthenticated: true, isInitializing: false, viewMode: resolvedViewMode });
        } catch {
          // Token inválido ou expirado — logout limpo
          set({ user: null, token: null, isAuthenticated: false, isInitializing: false, viewMode: 'aluno' });
        }
      },
    }),
    {
      name: 'virtulearning-auth',
      // Persistir token, user e viewMode
      partialize: (state) => ({ token: state.token, user: state.user, viewMode: state.viewMode }),
    }
  )
);
