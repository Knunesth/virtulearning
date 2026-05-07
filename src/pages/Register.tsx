import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Compass } from 'lucide-react';

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Mocking API delay
      await new Promise(r => setTimeout(r, 1000));
      
      // Auto login after successful registration
      setAuth({
        id_usuario: 2,
        tenant_id: 1,
        nome: data.nome,
        email: data.email,
        tipo_usuario: "aluno"
      }, "fake_jwt_token_register");

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar cadastro');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Crie sua conta</h1>
        <p className="text-[13px] text-[#71717a]">Comece sua jornada na programação hoje.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Nome Completo" 
          type="text" 
          placeholder="Kauã Thierry" 
          {...register('nome')}
          error={errors.nome?.message}
        />
        
        <Input 
          label="Email" 
          type="email" 
          placeholder="seu@email.com" 
          {...register('email')}
          error={errors.email?.message}
        />
        
        <div className="flex gap-4">
          <div className="w-1/2">
            <Input 
              label="Senha" 
              type="password" 
              placeholder="Senha forte" 
              {...register('senha')}
              error={errors.senha?.message}
            />
          </div>
          <div className="w-1/2">
            <Input 
              label="Confirmar Senha" 
              type="password" 
              placeholder="Confirme" 
              {...register('confirmarSenha')}
              error={errors.confirmarSenha?.message}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-2 bg-white text-black hover:bg-gray-200" 
          isLoading={isSubmitting}
        >
          Cadastrar Gratuitamente
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#27272a] flex flex-col items-center gap-4 text-xs">
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
