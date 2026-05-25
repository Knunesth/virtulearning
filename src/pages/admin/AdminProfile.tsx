import { useState } from 'react';
import { LogOut, Camera, AtSign, Phone, ShieldCheck, Smartphone, Laptop, ToggleRight, Key, Shield, User } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('dados');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Meu Perfil</h1>
        <p className="text-[#71717a] text-sm">Gerencie suas informações de administrador.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#27272a]">
        {['dados', 'seguranca'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative capitalize ${activeTab === tab ? 'text-danger' : 'text-[#71717a] hover:text-white'}`}
          >
            {tab === 'dados' ? 'Dados Pessoais' : 'Segurança'}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
          </button>
        ))}
      </div>

      {activeTab === 'dados' ? (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
            {/* Cover */}
            <div className="h-28 bg-gradient-to-r from-danger/20 via-[#1a0a0a] to-[#121214] relative">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
            </div>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl bg-danger/20 border-4 border-[#121214] flex items-center justify-center text-2xl font-bold text-danger group-hover:scale-105 transition-transform shadow-xl">
                    {user?.nome?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{user?.nome || 'Usuário Admin'}</h2>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Shield size={9} /> Master
                    </span>
                  </div>
                  <p className="text-sm text-[#71717a]">{user?.email || 'admin@virtulearning.com'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#27272a]">
              <h3 className="text-base font-bold text-white">Informações da Conta</h3>
              <p className="text-xs text-[#71717a] mt-0.5">Dados pessoais do administrador mestre.</p>
            </div>
            <div className="p-6 space-y-6">
              {[
                { label: 'Nome Completo', desc: 'Como aparece nos registros internos.', icon: <User size={15}/>, defaultValue: user?.nome || 'Usuário Admin' },
                { label: 'Nickname', desc: 'Identificador interno único.', icon: <AtSign size={15}/>, defaultValue: 'admin' },
                { label: 'Telefone', desc: 'Contato de emergência da conta.', icon: <Phone size={15}/>, defaultValue: '' },
              ].map((f, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-4 md:gap-8 ${i > 0 ? 'border-t border-[#27272a]/50 pt-6' : ''}`}>
                  <div className="w-full md:w-1/3 shrink-0">
                    <label className="block text-sm font-bold text-white mb-0.5">{f.label}</label>
                    <p className="text-xs text-[#71717a]">{f.desc}</p>
                  </div>
                  <div className="w-full md:w-2/3 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]">{f.icon}</div>
                    <Input defaultValue={f.defaultValue} className="pl-9" />
                  </div>
                </div>
              ))}

              {/* Bio */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-t border-[#27272a]/50 pt-6">
                <div className="w-full md:w-1/3 shrink-0">
                  <label className="block text-sm font-bold text-white mb-0.5">Notas Internas</label>
                  <p className="text-xs text-[#71717a]">Visível apenas para outros administradores.</p>
                </div>
                <div className="w-full md:w-2/3">
                  <Textarea placeholder="Observações, responsabilidades, etc..." className="h-24 resize-none" />
                </div>
              </div>

              <div className="flex justify-end border-t border-[#27272a] pt-6">
                <button className="bg-danger text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>

      ) : (
        <div className="space-y-6">
          {/* 2FA */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#27272a] flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                  <ShieldCheck size={18} className="text-success" /> Autenticação em Dois Fatores (2FA)
                </h3>
                <p className="text-sm text-[#71717a] max-w-2xl">Obrigatório para contas com nível Master. Insira o código do seu app autenticador ao fazer login.</p>
              </div>
              <button className="text-success shrink-0"><ToggleRight size={34} /></button>
            </div>
            <div className="p-4 bg-[#09090b]/40 flex items-center justify-between">
              <span className="text-xs text-[#a1a1aa]">Status: <strong className="text-success">Ativo</strong> — configurado há 1 mês</span>
              <button className="text-xs font-bold text-white border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] px-3 py-1.5 rounded-lg transition-colors">Reconfigurar App</button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#27272a]">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1"><Key size={16} className="text-danger" /> Alterar Senha</h3>
              <p className="text-sm text-[#71717a]">Use uma senha de no mínimo 12 caracteres para contas administrativas.</p>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#71717a] mb-2">Senha Atual</label>
                  <Input type="password" placeholder="••••••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#71717a] mb-2">Nova Senha</label>
                  <Input type="password" placeholder="Mínimo 12 caracteres" />
                  <div className="mt-2 flex gap-1 h-1">
                    <div className="flex-1 bg-danger rounded-full"></div>
                    <div className="flex-1 bg-warning rounded-full"></div>
                    <div className="flex-1 bg-success rounded-full"></div>
                    <div className="flex-1 bg-success rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-success mt-1">Força da senha: Forte</p>
                </div>
                <button className="h-9 px-5 bg-danger hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors">Atualizar Senha</button>
              </div>
              <div className="flex-1">
                <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 h-full">
                  <h4 className="text-xs font-bold text-white mb-3">Requisitos para contas Master:</h4>
                  <ul className="text-[11px] text-[#71717a] space-y-2">
                    {['Mínimo 12 caracteres', 'Letras maiúsculas e minúsculas', 'Números e símbolos (!@#$%)', 'Diferente das últimas 5 senhas'].map((r, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-success' : 'bg-[#27272a]'}`}></div>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1"><Laptop size={16} className="text-danger" /> Sessões Ativas</h3>
                <p className="text-sm text-[#71717a]">Dispositivos conectados à conta Master.</p>
              </div>
              <button className="text-xs font-bold text-[#71717a] border border-[#27272a] px-3 py-1.5 rounded-lg hover:bg-[#27272a] transition-colors">Encerrar outros</button>
            </div>
            <div className="divide-y divide-[#27272a]">
              {[
                { icon: <Laptop size={16} className="text-danger" />, device: 'Windows • Chrome', info: 'Sessão atual • São Paulo, BR', time: 'Agora', active: true },
                { icon: <Smartphone size={16} className="text-[#71717a]" />, device: 'iPhone • Safari', info: 'Último acesso • Campinas, BR', time: 'há 4h', active: false },
              ].map((s, i) => (
                <div key={i} className={`px-6 py-4 flex items-center gap-4 ${s.active ? 'bg-danger/5' : ''}`}>
                  <div className="w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{s.device}</p>
                    <p className={`text-xs ${s.active ? 'text-success' : 'text-[#71717a]'}`}>{s.info} • {s.time}</p>
                  </div>
                  {!s.active && <button className="text-xs text-danger hover:text-red-400 font-bold">Desconectar</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-[#0d0505] border border-danger/20 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white mb-0.5">Encerrar Sessão</h3>
          <p className="text-xs text-[#71717a]">Você será redirecionado para a tela de login.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white transition-all text-sm font-bold"
        >
          <LogOut size={15} /> Sair da Conta
        </button>
      </div>
    </div>
  );
};
