import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl">
        <Link to="/login" className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6 text-sm font-bold">
          <ArrowLeft size={16} /> Voltar para o login
        </Link>

        {success ? (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-success" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Verifique seu email</h2>
            <p className="text-muted mb-6">
              Se este email estiver cadastrado, você receberá um link em breve para redefinir sua senha.
            </p>
            <Link to="/login" className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors block">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-white mb-2">Esqueceu a senha?</h2>
            <p className="text-muted mb-8">Digite seu email e enviaremos um link de recuperação.</p>

            {error && (
              <div className="bg-danger/10 border border-danger/50 text-danger px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Enviar link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
