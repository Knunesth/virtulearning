import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore, type AuthUser } from '../store/useAuthStore';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ProfileUpdateData {
  nome?: string;
  bio?: string;
  telefone?: string;
  linkedin_url?: string;
  nickname?: string;
  avatar_url?: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Busca o perfil do usuário logado */
export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery<AuthUser>({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return {
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
      } as AuthUser;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

/** Atualiza o perfil do usuário logado */
export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const res = await api.put('/users/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      // Atualiza o store global com os novos dados
      if (data.user) {
        const updated: AuthUser = {
          id: data.user.id,
          tenant_id: data.user.tenant_id,
          nome: data.user.nome,
          email: data.user.email,
          tipo_usuario: data.user.tipo_usuario,
          avatar_url: data.user.avatar_url,
          bio: data.user.bio,
          nickname: data.user.nickname,
          telefone: data.user.telefone,
          linkedin_url: data.user.linkedin_url,
        };
        setUser(updated);
      }
      qc.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
