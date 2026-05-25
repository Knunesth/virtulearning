import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AppRoutes } from './routes';
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from './store/useAuthStore';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const logout   = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Configuração inicial do tema
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Valida o token persistido ao montar a aplicação
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Auto-logout por inatividade de 30 minutos
  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      return;
    }
    // Inicia o timer e escuta eventos de interação do usuário
    resetTimer();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [isAuthenticated, resetTimer]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
