import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Application {
  id: number;
  user_id: number;
  especialidade: string;
  linkedin_url: string | null;
  bio: string;
  cursos_pretendidos: string | null;
  anos_experiencia: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  revisado_por: number | null;
  revisado_em: string | null;
  motivo_rejeicao: string | null;
  created_at: string;
  solicitante: {
    id: number;
    nome: string;
    email: string;
  };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

import { useAuthStore } from '../store/useAuthStore';

/** Admin: lista candidaturas, opcionalmente filtrando por status */
export function useApplications(status?: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery<Application[]>({
    queryKey: ['applications', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const res = await api.get(`/applications${params}`);
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
}

/** Admin: aprova ou rejeita candidatura */
export function useReviewApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      motivo_rejeicao,
    }: {
      id: number;
      status: 'aprovado' | 'rejeitado';
      motivo_rejeicao?: string;
    }) => {
      const res = await api.patch(`/applications/${id}`, { status, motivo_rejeicao });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
