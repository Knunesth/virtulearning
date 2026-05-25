import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AppRoutes } from './routes';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  // Configuração inicial do tema
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Valida o token persistido ao montar a aplicação
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
