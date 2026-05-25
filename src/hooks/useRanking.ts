import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

import { useAuthStore } from '../store/useAuthStore';

export function useRanking(page: number = 1, limit: number = 20) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['ranking', page, limit],
    queryFn: () => api.get(`/ranking?page=${page}&limit=${limit}`).then(r => r.data),
    enabled: isAuthenticated
  });
}
