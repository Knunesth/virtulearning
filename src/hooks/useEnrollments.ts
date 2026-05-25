import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface Enrollment {
  id: number;
  aluno_id: number;
  curso_id: number;
  status: 'ativa' | 'concluida' | 'cancelada';
  progresso: number;
  created_at: string;
  updated_at: string;
  curso: {
    id: number;
    titulo: string;
    descricao: string;
    thumbnail: string | null;
    preco: number;
    nivel: string;
    duracao_horas: number;
    professor: { id: number; nome: string };
    _count: { modulos: number };
  };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

import { useAuthStore } from '../store/useAuthStore';

/** Retorna as matrículas do usuário logado */
export function useMyEnrollments(page: number = 1, limit: number = 10) {
  const { isAuthenticated } = useAuthStore();
  return useQuery<{ data: Enrollment[], total: number, page: number, totalPages: number }>({
    queryKey: ['enrollments', 'my', page, limit],
    queryFn: async () => {
      const res = await api.get(`/enrollments/my?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/** Matricula o aluno em um curso */
export function useEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (curso_id: number) => {
      const res = await api.post('/enrollments', { curso_id });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
  });
}

/** Atualiza o progresso de uma matrícula */
export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, progresso }: { id: number; progresso: number }) => {
      const res = await api.patch(`/enrollments/${id}/progress`, { progresso });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
  });
}
