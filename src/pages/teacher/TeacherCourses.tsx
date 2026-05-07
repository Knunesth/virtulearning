import { AlertTriangle, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const TeacherCourses = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Painel do Professor</h1>
        <p className="text-[#a1a1aa] text-sm">Gerencie seu conteúdo e seus alunos.</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Seus Cursos Publicados</h2>
        <Button className="font-bold text-xs px-4 py-2 bg-accent text-black hover:bg-accentHover transition-colors rounded-md flex items-center gap-2">
          <span>+</span> Novo Curso
        </Button>
      </div>

      {/* Course Creation Form (Open state as in mockup) */}
      <div className="bg-[#121214] border border-accent rounded-xl overflow-hidden mb-10 shadow-[0_0_15px_rgba(255,215,0,0.05)] relative">
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Criar Novo Conteúdo</h3>
          <button className="text-[#71717a] hover:text-white">✕</button>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Título do Curso</label>
              <Input placeholder="Ex: Curso Completo de Java" className="bg-[#09090b]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Categoria</label>
                <select className="w-full h-10 px-3 bg-[#09090b] border border-[#27272a] rounded-md text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none">
                  <option>Programação</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Tópico</label>
                <Input placeholder="Ex: Backend" className="bg-[#09090b]" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Preço (R$)</label>
              <Input type="number" defaultValue="0.00" className="bg-[#09090b]" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Descrição</label>
              <Textarea placeholder="O que o aluno vai aprender?" className="h-32 bg-[#09090b]" />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Capa do Curso (URL ou Upload)</label>
            <div className="flex gap-2 mb-4">
              <Input placeholder="https://..." className="bg-[#09090b] flex-1" />
              <button className="w-10 h-10 rounded-md border border-[#27272a] bg-[#09090b] flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
                <Upload size={16} />
              </button>
            </div>
            
            <div className="flex-1 bg-[#09090b] border border-dashed border-[#27272a] rounded-lg flex flex-col items-center justify-center text-[#71717a] mb-6 min-h-[200px]">
              <div className="w-10 h-10 mb-2 opacity-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <span className="text-xs">Preview</span>
            </div>
            
            <Button className="w-full font-bold">Criar Curso</Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      <div className="bg-[#1a0f14] border border-[#4a1c22] rounded-xl p-8 text-center flex flex-col items-center justify-center">
        <AlertTriangle className="text-danger mb-3" size={24} />
        <h3 className="text-danger font-bold text-sm mb-1">Não foi possível carregar os cursos</h3>
        <p className="text-[#a1a1aa] text-xs mb-4">Token não encontrado. Faça login novamente.</p>
        <button className="bg-danger text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};
