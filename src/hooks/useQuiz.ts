import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

import { useAuthStore } from '../store/useAuthStore';

export function useQuiz(courseId: string) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const key = ['quiz', courseId];

  const quiz = useQuery({

    queryKey: key,
    queryFn: () => api.get(`/courses/${courseId}/quiz`).then(r => r.data),
    enabled: !!courseId && isAuthenticated,
    retry: false
  });

  const submitAttempt = useMutation({
    mutationFn: (data: { quizId: number, answers: { questionId: number, optionId: number }[] }) => 
      api.post(`/quizzes/${data.quizId}/attempt`, { answers: data.answers }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    }
  });

  return { quiz, submitAttempt };
}
