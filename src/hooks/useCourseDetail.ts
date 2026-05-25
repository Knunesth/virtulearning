import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export interface Lesson {
  id: number;
  titulo: string;
  descricao: string;
  url_video?: string;
  duracao?: number;
  ordem: number;
  gratuita: boolean;
}

export interface Module {
  id: number;
  titulo: string;
  ordem: number;
  aulas: Lesson[];
}

export interface CourseDetail {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  thumbnail?: string;
  nivel: string;
  duracao_horas?: number;
  professor: {
    id: number;
    nome: string;
    avatar_url?: string;
    bio?: string;
  };
  modulos: Module[];
  _count: {
    matriculas: number;
  };
}

export function useCourseDetail(courseId: number) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Busca os detalhes do curso (público, mas traz tudo se autenticado/logado e dono/admin)
  const courseQuery = useQuery<CourseDetail>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });

  // Busca as matrículas do usuário para ver se ele já está matriculado neste curso
  const enrollmentQuery = useQuery({
    queryKey: ['enrollment', 'status', courseId],
    queryFn: async () => {
      const res = await api.get('/enrollments/my?limit=50');
      // Filtra nas matrículas retornadas se o curso atual está lá
      const enrollments = res.data.data || [];
      const enrollment = enrollments.find((e: any) => e.curso_id === courseId);
      return enrollment || null;
    },
    enabled: !!courseId && isAuthenticated,
  });

  // Busca as aulas concluídas pelo usuário neste curso
  const progressQuery = useQuery<number[]>({
    queryKey: ['course', courseId, 'progress'],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/progress`);
      return res.data; // array de lesson_id
    },
    enabled: !!courseId && isAuthenticated && !!enrollmentQuery.data,
  });

  // Matricular no curso
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/enrollments', { curso_id: courseId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', 'status', courseId] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
  });

  // Marcar aula como concluída
  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const res = await api.patch(`/lessons/${lessonId}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', 'status', courseId] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
  });

  const isEnrolled = !!enrollmentQuery.data;

  return {
    course: courseQuery.data,
    isLoadingCourse: courseQuery.isLoading,
    isEnrolled,
    enrollment: enrollmentQuery.data,
    isLoadingEnrollment: enrollmentQuery.isLoading,
    completedLessons: progressQuery.data || [],
    enrollMutation,
    completeLessonMutation,
  };
}
