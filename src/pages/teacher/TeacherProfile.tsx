import { useState } from 'react';
import { Lock, LogOut, Mail, Camera, AtSign, Phone, Link as LinkIcon, Medal, Plus, User, ShieldCheck, Smartphone, Laptop, ToggleRight, Key } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('dados');
  
  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Seu Perfil</h1>
        <p className="text-[#a1a1aa] text-sm">Gerencie suas informações pessoais e configurações de segurança.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#27272a] mb-10">
        <button 
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'dados' ? 'text-accent' : 'text-[#a1a1aa] hover:text-white'}`}
          onClick={() => setActiveTab('dados')}
        >
          Dados Pessoais
          {activeTab === 'dados' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>}
        </button>
        <button 
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'seguranca' ? 'text-accent' : 'text-[#a1a1aa] hover:text-white'}`}
          onClick={() => setActiveTab('seguranca')}
        >
          Segurança da Conta
          {activeTab === 'seguranca' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'dados' ? (
        <div className="flex flex-col gap-8">
          
          {/* Profile Header (Cover & Avatar) */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden shadow-lg">
            {/* Cover Gradient */}
            <div className="h-32 bg-gradient-to-r from-accent/20 via-[#18181b] to-[#121214] relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-30"></div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-black border-4 border-[#121214] flex items-center justify-center text-3xl font-bold text-accent group-hover:scale-105 transition-transform shadow-xl overflow-hidden relative z-10">
                    {/* Placeholder Avatar */}
                    UT
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                
                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-bold text-white">Usuário Teste</h2>
                  <p className="text-sm text-accent">@usuario</p>
                </div>
                
                <div className="pb-2">
                  <button className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-[#3f3f46]">
                    <LinkIcon size={16} /> Ver Perfil Público
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Form (Horizontal SaaS Layout) */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#27272a]">
              <h3 className="text-lg font-bold text-white mb-1">Informações Básicas</h3>
              <p className="text-xs text-[#a1a1aa]">Estes dados serão exibidos no seu perfil público e nos seus cursos.</p>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Nome */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-full md:w-1/3 shrink-0">
                  <label className="block text-sm font-bold text-white mb-1">Nome Completo</label>
                  <p className="text-xs text-[#71717a]">Seu nome como será visto pelos alunos.</p>
                </div>
                <div className="w-full md:w-2/3 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                    <User size={16} />
                  </div>
                  <Input defaultValue="Usuário Teste" className="pl-10" />
                </div>
              </div>

              {/* Nickname */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-t border-[#27272a]/50 pt-8">
                <div className="w-full md:w-1/3 shrink-0">
                  <label className="block text-sm font-bold text-white mb-1">Nickname</label>
                  <p className="text-xs text-[#71717a]">Seu identificador único na plataforma.</p>
                </div>
                <div className="w-full md:w-2/3 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                    <AtSign size={16} />
                  </div>
                  <Input defaultValue="usuario" className="pl-10" />
                </div>
              </div>

              {/* Telefone */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-t border-[#27272a]/50 pt-8">
                <div className="w-full md:w-1/3 shrink-0">
                  <label className="block text-sm font-bold text-white mb-1">WhatsApp</label>
                  <p className="text-xs text-[#71717a]">Para contato do suporte ou alunos VIPs.</p>
                </div>
                <div className="w-full md:w-2/3 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                    <Phone size={16} />
                  </div>
                  <Input placeholder="(00) 00000-0000" className="pl-10" />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-t border-[#27272a]/50 pt-8">
                <div className="w-full md:w-1/3 shrink-0">
                  <label className="block text-sm font-bold text-white mb-1">Sobre Mim</label>
                  <p className="text-xs text-[#71717a]">Uma breve biografia para os alunos conhecerem sua experiência.</p>
                </div>
                <div className="w-full md:w-2/3">
                  <Textarea placeholder="Escreva uma breve apresentação profissional..." className="h-32 resize-y" />
                  <p className="text-[10px] text-right text-[#71717a] mt-2">Máximo 500 caracteres.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificações */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#27272a] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Certificações e Conquistas</h3>
                <p className="text-xs text-[#a1a1aa]">Adicione selos de autoridade ao seu perfil.</p>
              </div>
            </div>
            <div className="p-8">
              {/* Empty State */}
              <div className="border border-dashed border-[#27272a] rounded-xl py-12 px-6 flex flex-col items-center text-center bg-[#09090b]/50">
                <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4 border border-accent/10">
                  <Medal size={32} className="text-accent/50" />
                </div>
                <h4 className="text-white font-bold mb-2">Nenhuma certificação adicionada</h4>
                <p className="text-[#a1a1aa] text-xs max-w-sm mb-6">Alunos confiam mais em professores com histórico comprovado. Adicione seus diplomas ou certificados relevantes.</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-sm font-bold transition-colors">
                  <Plus size={16} /> Adicionar Certificação
                </button>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4 pb-10 sticky bottom-0 z-10 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
            <button className="bg-accent text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:scale-105 transition-all">
              Salvar Todas as Alterações
            </button>
          </div>

        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Autenticação em Dois Fatores (2FA) */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#27272a] flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="text-success" size={20} /> Autenticação em Dois Fatores (2FA)
                </h3>
                <p className="text-sm text-[#a1a1aa] max-w-2xl">
                  Adicione uma camada extra de segurança à sua conta. Quando ativado, você precisará inserir um código gerado pelo seu aplicativo de autenticação (como Google Authenticator) ao fazer login.
                </p>
              </div>
              <button className="text-success hover:text-green-400 transition-colors">
                <ToggleRight size={36} />
              </button>
            </div>
            <div className="bg-[#09090b]/50 p-6 flex items-center justify-between">
              <span className="text-sm text-[#a1a1aa]">Status: <strong className="text-success">Ativado</strong> (Configurado há 2 meses)</span>
              <button className="text-sm font-bold text-white border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] px-4 py-2 rounded-lg transition-colors">
                Configurar App
              </button>
            </div>
          </div>

          {/* Trocar Senha */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#27272a]">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Key className="text-accent" size={20} /> Alterar Senha
              </h3>
              <p className="text-sm text-[#a1a1aa]">Recomendamos o uso de uma senha forte com letras, números e símbolos.</p>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Senha Atual</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Nova Senha</label>
                  <Input type="password" placeholder="Mínimo 8 caracteres" />
                  <div className="mt-2 flex gap-1 h-1">
                    <div className="flex-1 bg-danger rounded-full"></div>
                    <div className="flex-1 bg-warning rounded-full"></div>
                    <div className="flex-1 bg-success rounded-full"></div>
                    <div className="flex-1 bg-[#27272a] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-success mt-1">Força da senha: Boa</p>
                </div>
                <button className="h-10 px-6 bg-accent hover:bg-yellow-400 text-black rounded-lg text-sm font-bold transition-colors shadow-lg shadow-accent/20">
                  Atualizar Senha
                </button>
              </div>
              
              <div className="flex-1 hidden md:block">
                {/* Dicas de segurança lado a lado */}
                <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-6 h-full">
                  <h4 className="text-sm font-bold text-white mb-4">Dicas para uma senha segura:</h4>
                  <ul className="text-xs text-[#a1a1aa] space-y-3">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                      Pelo menos 8 caracteres (idealmente 12+)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                      Misture letras maiúsculas e minúsculas
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                      Inclua números e símbolos (!@#$%^&*)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#27272a]"></div>
                      Não use informações pessoais óbvias
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sessões Ativas */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[#27272a] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Laptop className="text-accent" size={20} /> Dispositivos Conectados
                </h3>
                <p className="text-sm text-[#a1a1aa]">Sessões ativas na sua conta neste momento.</p>
              </div>
              <button className="text-xs font-bold text-[#a1a1aa] hover:text-white border border-[#27272a] px-4 py-2 rounded-lg transition-colors">
                Desconectar todos os outros
              </button>
            </div>
            
            <div className="divide-y divide-[#27272a]">
              <div className="p-6 flex items-center justify-between bg-accent/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
                    <Laptop size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Windows • Chrome</h4>
                    <p className="text-xs text-success">Ativo agora (Sessão atual) • São Paulo, BR</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
                    <Smartphone size={18} className="text-[#a1a1aa]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">iPhone 13 • Safari</h4>
                    <p className="text-xs text-[#71717a]">Último acesso há 2 horas • Campinas, BR</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-danger hover:text-red-400">Desconectar</button>
              </div>
            </div>
          </div>

          {/* Trocar Email (Secundário) */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-8">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Mail size={16} className="text-[#a1a1aa]" /> Alterar Email de Acesso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Email Atual</label>
                <Input type="email" disabled defaultValue="usuario@teste.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#a1a1aa] mb-2">Novo Email</label>
                <Input type="email" placeholder="novo@email.com" />
              </div>
              <button className="h-10 w-full bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-sm font-bold transition-colors">
                Solicitar Troca
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-16 border-t border-[#27272a] pt-8 flex items-center justify-between bg-[#121214] p-8 rounded-2xl border border-danger/20">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Zona de Perigo</h3>
          <p className="text-[#a1a1aa] text-xs">Ações destrutivas para a sua conta.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white transition-colors text-sm font-bold">
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>
    </div>
  );
};
