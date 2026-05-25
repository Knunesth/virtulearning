import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

let API_URL = import.meta.env.VITE_API_BASE_URL || '';
if (API_URL && !API_URL.endsWith('/api')) {
  API_URL += '/api';
}

if (!API_URL) {
  console.error('[api.ts] VITE_API_BASE_URL não definida. Crie o arquivo .env na raiz do frontend.');
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Essencial para HttpOnly cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: injeta access token em todas as requisições ───────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: silent refresh em caso de 401 ─────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evita loop infinito: não tenta refresh na própria rota de refresh ou login
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }
    const isAuthRoute = false;

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // Se já há um refresh em andamento, enfileira essa requisição
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        useAuthStore.getState().setToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
