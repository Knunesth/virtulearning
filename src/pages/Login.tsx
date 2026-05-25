import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { Compass } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);

  const successMessage = location.state?.message;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });


  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        senha: data.senha
      });

      const { user, access_token } = res.data;
      
      setAuth({
        id: user.id,
        tenant_id: user.tenant_id,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario
      }, access_token);

      if (user.tipo_usuario === 'admin') navigate('/admin');
      else if (user.tipo_usuario === 'professor') navigate('/teacher');
      else navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais.';
      alert(msg);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
          {successMessage}
        </div>
      )}

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
