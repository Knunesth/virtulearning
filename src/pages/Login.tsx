import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
// import { api } from '../services/api';
import { Compass } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const handleQuickLogin = (role: 'aluno' | 'professor') => {
    setAuth({
      id_usuario: role === 'professor' ? 2 : 1,
      tenant_id: 1,
      nome: role === 'professor' ? "Prof. João" : "Aluno Kauã",
      email: `${role}@virtulearning.com`,
      tipo_usuario: role
    }, "fake_jwt_token");

    navigate(role === 'professor' ? '/teacher' : '/dashboard');
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      // Mocking success based on email typed
      const role = data.email.includes('prof') ? 'professor' : 'aluno';
      
      await new Promise(r => setTimeout(r, 1000));
      setAuth({
        id_usuario: role === 'professor' ? 2 : 1,
        tenant_id: 1,
        nome: role === 'professor' ? "Prof. Especialista" : "Aluno Padrão",
        email: data.email,
        tipo_usuario: role
      }, "fake_jwt_token");

      navigate(role === 'professor' ? '/teacher' : '/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar login');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Bem-vindo de volta</h1>
        <p className="text-[13px] text-[#71717a]">Digite suas credenciais para acessar.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Email" 
          type="email" 
          placeholder="seu@email.com" 
          {...register('email')}
          error={errors.email?.message}
        />
        
        <div className="space-y-1">
          <Input 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            {...register('senha')}
            error={errors.senha?.message}
          />
          <div className="flex justify-end pt-1">
            <Link to="/forgot-password" className="text-[11px] font-medium text-[#71717a] hover:text-[#d4d4d8] transition-colors">
              Esqueci minha senha
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
          Acessar Plataforma
        </Button>

        {/* Quick Login Hacks for Dev */}
        <div className="pt-4 border-t border-border mt-4">
          <p className="text-xs text-center text-muted mb-3 uppercase tracking-wider font-bold">Acesso Rápido (Dev)</p>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-xs font-bold border-border/50 text-white hover:bg-white/5" 
              onClick={() => handleQuickLogin('aluno')}
            >
              Sou Aluno
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-xs font-bold border-accent/30 text-accent hover:bg-accent/10" 
              onClick={() => handleQuickLogin('professor')}
            >
              Sou Professor
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 pt-6 flex flex-col items-center gap-4 text-xs">
        <p className="text-[#71717a]">
          Quer fazer parte do time?{' '}
          <Link to="/apply" className="font-bold text-accent hover:text-accentHover transition-colors">
            Trabalhe Conosco como Professor
          </Link>
        </p>
        
        <Link to="/catalog" className="flex items-center gap-1.5 text-[#71717a] hover:text-[#d4d4d8] transition-colors">
          <Compass size={14} /> Explorar Catálogo sem Login
        </Link>
      </div>
    </div>
  );
};
