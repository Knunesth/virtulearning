import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Compass } from 'lucide-react';

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um símbolo'),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const PasswordStrength = ({ password }: { password: string }) => {
  const requirements = [
    { label: '8+ caracteres', met: password.length >= 8 },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Um número', met: /[0-9]/.test(password) },
    { label: 'Símbolo especial', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const metCount = requirements.filter(r => r.met).length;
  
  let strengthConfig = { label: 'Muito Fraca', color: 'bg-red-500', text: 'text-red-400' };
  if (metCount === 2) strengthConfig = { label: 'Fraca', color: 'bg-orange-500', text: 'text-orange-400' };
  if (metCount === 3) strengthConfig = { label: 'Boa', color: 'bg-yellow-500', text: 'text-yellow-400' };
  if (metCount === 4) strengthConfig = { label: 'Forte', color: 'bg-green-500', text: 'text-green-400' };
  
  if (!password) return null;

  return (
    <div className="bg-[#121214] p-3.5 rounded-xl border border-[#27272a] text-xs shadow-inner">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[#a1a1aa] font-medium text-[11px] uppercase tracking-wider">Segurança da Senha</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${strengthConfig.text} bg-opacity-10 bg-current`}>
          {strengthConfig.label}
        </span>
      </div>
      <div className="flex gap-1.5 mb-3.5">
        {[1, 2, 3, 4].map((level) => (
          <div 
            key={level} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              level <= metCount ? strengthConfig.color : 'bg-[#27272a]'
            }`} 
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {requirements.map((req, i) => (
          <div key={i} className={`flex items-center gap-2 transition-colors duration-300 ${req.met ? 'text-green-400' : 'text-[#71717a]'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-300 ${req.met ? 'border-green-400 bg-green-400/20 scale-110' : 'border-[#3f3f46]'}`}>
              {req.met && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <span className="text-[11px]">{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Register = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const senha = watch('senha') || '';

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post('/auth/register', {
        nome: data.nome,
        email: data.email,
        senha: data.senha
      });

      const { message } = res.data;
      
      alert(`Cadastro realizado com sucesso! Você já pode fazer login.`);

      // Redireciona para o login (aguardando a verificação no email)
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao realizar cadastro. Verifique os dados fornecidos.';
      alert(msg);
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

        <PasswordStrength password={senha} />

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
