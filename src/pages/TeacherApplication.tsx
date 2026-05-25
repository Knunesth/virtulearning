import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

const applicationSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  areas: z.string().min(2, 'Preencha suas áreas de interesse'),
  experiencia: z.string().min(20, 'Conte-nos um pouco mais sobre você (mínimo 20 caracteres)')
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export const TeacherApplication = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema)
  });

  const onSubmit = async () => {
    try {
      await new Promise(r => setTimeout(r, 1500)); // Fake API
      // In a real app we would send this data to the backend
    } catch (error) {
      alert('Erro ao enviar candidatura.');
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-white mb-2">Candidatura Enviada!</h1>
        <p className="text-[#a1a1aa] mb-8">Recebemos o seu perfil. Nossa equipe irá analisar e entrar em contato em breve através do email fornecido.</p>
        <Button onClick={() => window.location.href = '/'}>Voltar ao Início</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Compartilhe seu Conhecimento</h1>
        <p className="text-[#a1a1aa] text-sm max-w-xl mx-auto leading-relaxed">
          Junte-se ao time de professores da VirtuLearning e impacte milhares de alunos. Estamos procurando especialistas apaixonados por tecnologia.
        </p>
      </div>

      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-[#27272a]">
          <h2 className="text-base font-bold text-white">Formulário de Candidatura</h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nome Completo" 
              placeholder="Seu nome" 
              {...register('nome')}
              error={errors.nome?.message}
            />
            <Input 
              label="Email Profissional" 
              type="email"
              placeholder="seu@email.com" 
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Telefone / WhatsApp" 
              placeholder="(11) 99999-9999" 
              {...register('telefone')}
              error={errors.telefone?.message}
            />
            <Input 
              label="Perfil LinkedIn" 
              placeholder="https://linkedin.com/in/..." 
              {...register('linkedin')}
              error={errors.linkedin?.message}
            />
          </div>

          <div>
            <Input 
              label="Áreas de Interesse" 
              placeholder="Ex: React, Node.js, Python, Design..." 
              {...register('areas')}
              error={errors.areas?.message}
            />
            <p className="text-[11px] text-[#71717a] mt-1.5">Separe por vírgulas.</p>
          </div>

          <Textarea 
            label="Sobre Você e sua Experiência" 
            placeholder="Conte brevemente sobre sua carreira e por que quer ensinar..." 
            {...register('experiencia')}
            error={errors.experiencia?.message}
          />

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full text-[15px] h-12 shadow-md" 
              isLoading={isSubmitting}
            >
              Enviar Candidatura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
