import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: ('aluno' | 'professor' | 'admin')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing, user } = useAuthStore();

  // Aguarda a validação do token antes de redirecionar
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
