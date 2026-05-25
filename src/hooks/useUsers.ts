import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'professor' | 'admin';
  status: 'ativo' | 'suspenso' | 'pendente_verificacao';
  email_verificado: boolean;
  avatar_url: string | null;
  ultimo_login: string | null;
  created_at: string;
}

export interface UsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  pages: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

import { useAuthStore } from '../store/useAuthStore';

/** Admin: lista usuários com filtros e paginação */
export function useAdminUsers(filters: UserFilters = {}) {
  const { isAuthenticated } = useAuthStore();
  const { search, role, status, page = 1, limit = 20 } = filters;
  return useQuery<UsersResponse>({
    queryKey: ['users', 'admin', { search, role, status, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'todos') params.set('role', role);
      if (status) params.set('status', status);
      params.set('page', String(page));
      params.set('limit', String(limit));
      const res = await api.get(`/users?${params}`);
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
}

/** Admin: altera cargo de um usuário */
export function useChangeUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: number;
      role: 'aluno' | 'professor' | 'admin';
    }) => {
      const res = await api.patch(`/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users', 'admin'] });
    },
  });
}

/** Admin: altera status de um usuário */
export function useChangeUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: 'ativo' | 'suspenso';
    }) => {
      const res = await api.patch(`/users/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users', 'admin'] });
    },
  });
}
