import { useState } from 'react';
import { Eye, Lock, LogOut, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('dados');
  
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Painel do Professor</h1>
        <p className="text-[#a1a1aa] text-sm">Gerencie seu conteúdo e seus alunos.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#27272a] mb-8">
        <div className="flex gap-8">
          <button 
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'dados' ? 'text-accent' : 'text-[#a1a1aa] hover:text-white'}`}
            onClick={() => setActiveTab('dados')}
          >
            Dados Pessoais
            {activeTab === 'dados' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>}
          </button>
          <button 
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'seguranca' ? 'text-accent' : 'text-[#a1a1aa] hover:text-white'}`}
            onClick={() => setActiveTab('seguranca')}
          >
            Segurança da Conta
            {activeTab === 'seguranca' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>}
          </button>
        </div>
        
        <div className="flex gap-3 pb-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#121214] text-xs font-medium text-white hover:bg-[#27272a] transition-colors">
            <Eye size={14} /> Visualizar
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-accent/20 bg-accent/10 text-xs font-bold text-accent hover:bg-accent/20 transition-colors">
            <Lock size={14} /> Habilitar Edição
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'dados' ? (
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-8 relative overflow-hidden">
          
          {/* Overlay Blocked State */}
          <div className="absolute inset-0 bg-[#09090b]/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-[#18181b] border border-[#27272a] px-4 py-2 rounded-md shadow-lg flex items-center gap-2 text-[#a1a1aa] text-sm">
              <Lock size={16} /> Edição bloqueada
            </div>
          </div>

          {/* Form Content */}
          <div className="opacity-50">
            <div className="flex flex-col items-center mb-10">
              <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-3xl font-bold text-black mb-4">
                UT
              </div>
              <p className="text-xs text-[#a1a1aa] mb-2">Ou cole a URL da foto</p>
              <Input placeholder="https://..." className="max-w-xs text-center text-xs h-8" />
              <p className="text-[10px] text-[#71717a] mt-2">Habilite a edição para alterar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Nome Completo</label>
                <Input defaultValue="Usuário Teste" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Nickname (@único)</label>
                <Input defaultValue="usuario" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Gênero</label>
                <select className="w-full h-10 px-3 bg-[#09090b] border border-[#27272a] rounded-md text-sm text-white focus:outline-none appearance-none">
                  <option>Prefiro não dizer / Outro</option>
                </select>
              </div>
              <div />

              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Telefone (WhatsApp)</label>
                <Input placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Link Rede Social</label>
                <Input placeholder="https://..." />
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Biografia / Sobre Mim</label>
              <Textarea placeholder="Conte sua experiência..." className="h-32" />
            </div>

            <div className="border-t border-[#27272a] pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#a1a1aa] flex items-center gap-2">
                  <Lock size={14} className="text-accent" /> Certificações e Competências
                </h3>
                <button className="text-xs font-bold text-[#a1a1aa]">
                  + Adicionar
                </button>
              </div>
              <div className="bg-[#09090b] border border-[#27272a] rounded-md py-6 text-center text-xs text-[#71717a]">
                Nenhuma formação registrada.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-[#121214] border border-[#27272a] rounded-xl p-8">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={16} className="text-accent" /> Trocar Senha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Senha Atual</label>
                <Input type="password" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Nova Senha</label>
                <Input type="password" />
              </div>
              <button className="h-10 w-full bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-md text-sm font-bold transition-colors">
                Confirmar
              </button>
            </div>
          </div>

          <div className="bg-[#121214] border border-[#27272a] rounded-xl p-8">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Mail size={16} className="text-accent" /> Trocar Email
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Email Atual</label>
                <Input type="email" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Novo Email</label>
                <Input type="email" />
              </div>
              <button className="h-10 w-full bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-md text-sm font-bold transition-colors">
                Solicitar Troca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-16 border-t border-[#27272a] pt-8 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">CONTA</h3>
          <p className="text-[#a1a1aa] text-xs">Encerrar sessão.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#2a1215] border border-[#4a1c22] text-danger hover:bg-danger hover:text-white transition-colors text-sm font-bold">
          <LogOut size={16} /> Sair da Conta
        </button>
      </div>
    </div>
  );
};
