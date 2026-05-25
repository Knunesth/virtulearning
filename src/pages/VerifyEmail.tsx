import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação ausente.');
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Email verificado com sucesso.');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Token inválido ou expirado.');
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-accent mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Verificando email...</h2>
            <p className="text-muted">Por favor, aguarde.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="text-success mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Sucesso!</h2>
            <p className="text-muted mb-6">{message}</p>
            <p className="text-sm text-accent">Redirecionando para o login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-danger mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Erro na Verificação</h2>
            <p className="text-muted mb-6">{message}</p>
            <Link to="/login" className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors block">
              Ir para o Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
