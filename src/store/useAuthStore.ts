import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import { queryClient } from '../lib/react-query';

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
  // token vive APENAS em memória — nunca no localStorage
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

      logout: () => {
        queryClient.clear();
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false, viewMode: 'aluno' });
      },

      initAuth: async () => {
        const { token, viewMode } = get();

        // Se já temos o token em memória, só valida o usuário
        if (token) {
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
            let resolvedViewMode = viewMode;
            if (user.tipo_usuario === 'aluno' && viewMode !== 'aluno') resolvedViewMode = 'aluno';
            if (user.tipo_usuario === 'professor' && viewMode === 'admin') resolvedViewMode = 'professor';
            set({ user, isAuthenticated: true, isInitializing: false, viewMode: resolvedViewMode });
            return;
          } catch {
            // Token em memória inválido — tenta renovar via refresh cookie
          }
        }

        // Tenta renovar sessão via cookie HttpOnly (refresh token)
        try {
          const refreshRes = await api.post('/auth/refresh');
          const newToken: string = refreshRes.data.accessToken;
          set({ token: newToken });

          const meRes = await api.get('/auth/me');
          const user: AuthUser = {
            id: meRes.data.user.id,
            tenant_id: meRes.data.user.tenant_id,
            nome: meRes.data.user.nome,
            email: meRes.data.user.email,
            tipo_usuario: meRes.data.user.tipo_usuario,
            avatar_url: meRes.data.user.avatar_url,
            bio: meRes.data.user.bio,
            nickname: meRes.data.user.nickname,
            telefone: meRes.data.user.telefone,
            linkedin_url: meRes.data.user.linkedin_url,
          };
          let resolvedViewMode = viewMode;
          if (user.tipo_usuario === 'aluno' && viewMode !== 'aluno') resolvedViewMode = 'aluno';
          if (user.tipo_usuario === 'professor' && viewMode === 'admin') resolvedViewMode = 'professor';
          set({ user, isAuthenticated: true, isInitializing: false, viewMode: resolvedViewMode });
        } catch {
          // Sem token válido e sem cookie válido — sessão expirada
          set({ user: null, token: null, isAuthenticated: false, isInitializing: false, viewMode: 'aluno' });
        }
      },
    }),
    {
      name: 'virtulearning-auth',
      // SEGURANÇA: Persistir APENAS user e viewMode — NUNCA o accessToken
      // O token vive somente em memória (estado Zustand não persistido)
      partialize: (state) => ({ user: state.user, viewMode: state.viewMode }),
    }
  )
);
