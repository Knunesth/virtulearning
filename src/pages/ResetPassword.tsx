import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden px-4">
        <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative z-10 text-center">
          <AlertCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Link Inválido</h2>
          <p className="text-muted mb-6">O link de redefinição de senha é inválido ou está ausente.</p>
          <Link to="/" className="text-accent hover:underline font-bold text-sm">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login', { state: { message: 'Senha redefinida com sucesso! Faça login para continuar.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao redefinir a senha. O link pode estar expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <Lock className="text-accent w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Redefinir Senha</h2>
          <p className="text-muted text-sm px-4">
            Escolha uma nova senha segura para acessar sua conta.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo de 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 bg-black/40 border-white/5 focus:border-accent text-white"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 pr-12 h-14 bg-black/40 border-white/5 focus:border-accent text-white"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full h-14 font-black text-lg bg-accent text-black hover:bg-yellow-400 mt-4 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Salvar e Continuar'}
          </Button>
        </form>
      </div>
    </div>
  );
};
