import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface AdminFinancialsResponse {
  kpis: {
    receitaMensal: { value: number; change: string; up: boolean };
    mrr: { value: number; change: string; up: boolean };
    ticketMedio: { value: number; change: string; up: boolean };
    reembolsos: { value: number; change: string; up: boolean };
  };
  chartData: Array<{ name: string; revenue: number }>;
  topCourses: Array<{ title: string; revenue: number; pct: number }>;
  transactions: Array<{
    id: number;
    name: string;
    course: string;
    amount: number;
    date: string;
    type: 'compra' | 'reembolso';
  }>;
}

export const useAdminFinancials = () => {
  return useQuery({
    queryKey: ['admin-financials'],
    queryFn: async () => {
      const { data } = await api.get<AdminFinancialsResponse>('/stats/admin/financials');
      return data;
    },
  });
};
