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

  const onSubmit = async (data: LoginForm) => {
    try {
      // Fake API call for now to demonstrate routing and state
      // const response = await api.post('/auth/login', { email: data.email, senha: data.senha });
      // setAuth(response.data.user, response.data.accessToken);
      
      // Mocking success
      await new Promise(r => setTimeout(r, 1000));
      setAuth({
        id_usuario: 1,
        tenant_id: 1,
        nome: "Kaua",
        email: data.email,
        tipo_usuario: "admin"
      }, "fake_jwt_token");

      navigate('/dashboard');
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
      </form>

      <div className="mt-8 pt-8 flex flex-col items-center gap-4 text-xs">
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
