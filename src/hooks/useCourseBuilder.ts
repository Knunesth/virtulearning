import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

import { useAuthStore } from '../store/useAuthStore';

export function useCourseBuilder(courseId: string) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const key = ['course-builder', courseId];
  
  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const course = useQuery({

    queryKey: key,
    queryFn: () => api.get('/courses/' + courseId).then(r => r.data),
    enabled: !!courseId && isAuthenticated,
  });

  const createModule = useMutation({
    mutationFn: (data: { titulo: string; ordem: number }) => api.post('/courses/' + courseId + '/modules', data),
    onSuccess: invalidate,
  });
  
  const updateModule = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put('/modules/' + id, data),
    onSuccess: invalidate,
  });
  
  const deleteModule = useMutation({
    mutationFn: (id: number) => api.delete('/modules/' + id),
    onSuccess: invalidate,
  });

  const createLesson = useMutation({
    mutationFn: ({ moduleId, ...data }: any) => api.post('/modules/' + moduleId + '/lessons', data),
    onSuccess: invalidate,
  });
  
  const updateLesson = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put('/lessons/' + id, data),
    onSuccess: invalidate,
  });
  
  const deleteLesson = useMutation({
    mutationFn: (id: number) => api.delete('/lessons/' + id),
    onSuccess: invalidate,
  });

  return { course, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson };
}
