import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Course {
  id: number;
  titulo: string;
  descricao: string;
  thumbnail: string | null;
  preco: number;
  status: 'rascunho' | 'publicado' | 'suspenso' | 'arquivado';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao_horas: number;
  linguagem: string;
  created_at: string;
  professor: { id: number; nome: string; avatar_url?: string | null };
  _count?: { matriculas: number; modulos: number };
}

export interface CoursesResponse {
  data: Course[];
  total: number;
  page: number;
  pages: number;
}

export interface CourseFilters {
  search?: string;
  nivel?: string;
  page?: number;
  limit?: number;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Lista cursos publicados (público) */
export function useCourses(filters: CourseFilters = {}) {
  const { search, nivel, page = 1, limit = 12 } = filters;
  return useQuery<CoursesResponse>({
    queryKey: ['courses', 'public', { search, nivel, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (nivel) params.set('nivel', nivel);
      params.set('page', String(page));
      params.set('limit', String(limit));
      const res = await api.get(`/courses?${params}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // mantém dados anteriores durante paginação
  });
}

/** Detalhe de um curso */
export function useCourse(id: number | undefined) {
  return useQuery<Course>({
    queryKey: ['courses', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

import { useAuthStore } from '../store/useAuthStore';

/** Admin: lista todos os cursos */
export function useAdminCourses() {
  const { isAuthenticated } = useAuthStore();
  return useQuery<Course[]>({
    queryKey: ['courses', 'admin', 'all'],
    queryFn: async () => {
      const res = await api.get('/courses/admin/all');
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
}

/** Admin: altera status de um curso */
export function useChangeCourseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: 'publicado' | 'suspenso' | 'arquivado';
    }) => {
      const res = await api.patch(`/courses/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

/** Admin: arquiva curso */
export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/courses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

/** Professor: cria curso */
export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      titulo: string;
      descricao: string;
      preco: number;
      thumbnail?: string;
      nivel?: 'iniciante' | 'intermediario' | 'avancado';
      duracao_horas?: number;
    }) => {
      const res = await api.post('/courses', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

/** Professor: edita seu curso */
export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{
        titulo: string;
        descricao: string;
        preco: number;
        thumbnail: string;
        nivel: string;
        status: string;
        duracao_horas: number;
      }>;
    }) => {
      const res = await api.put(`/courses/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['courses', id] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
