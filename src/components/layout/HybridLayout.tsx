import { useAuthStore } from '../../store/useAuthStore';
import { MainLayout } from './MainLayout';
import { DashboardLayout } from './DashboardLayout';

export const HybridLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <DashboardLayout />;
  }

  return <MainLayout />;
};
