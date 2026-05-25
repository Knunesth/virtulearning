import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

import { useAuthStore } from '../store/useAuthStore';

export function useMessages(page: number = 1, limit: number = 10) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['messages', 'conversations', page, limit],
    queryFn: async () => {
      const res = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minuto
  });
}
