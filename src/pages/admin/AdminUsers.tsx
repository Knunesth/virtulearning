import { useState } from 'react';
import { Search, MoreVertical, Shield, UserX, UserCheck, ChevronDown, Users, UserCog, GraduationCap, ShieldCheck } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'aluno', status: 'ativo', joinedAt: '12/04/2026', courses: 4, lastSeen: 'há 2h' },
  { id: '2', name: 'Maria Souza', email: 'maria@example.com', role: 'professor', status: 'ativo', joinedAt: '10/04/2026', courses: 2, lastSeen: 'há 15min' },
  { id: '3', name: 'Pedro Alves', email: 'pedro@example.com', role: 'aluno', status: 'suspenso', joinedAt: '05/04/2026', courses: 1, lastSeen: 'há 3 dias' },
  { id: '4', name: 'Ana Costa', email: 'ana@example.com', role: 'admin', status: 'ativo', joinedAt: '01/01/2026', courses: 0, lastSeen: 'agora' },
  { id: '5', name: 'Lucas Ferreira', email: 'lucas@example.com', role: 'aluno', status: 'ativo', joinedAt: '08/04/2026', courses: 7, lastSeen: 'há 1h' },
  { id: '6', name: 'Carla Dias', email: 'carla@example.com', role: 'professor', status: 'ativo', joinedAt: '02/03/2026', courses: 3, lastSeen: 'há 30min' },
];

type Role = 'aluno' | 'professor' | 'admin';

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  admin:     { label: 'Admin',     color: 'text-danger',   bg: 'bg-danger/10 border-danger/20',   icon: <ShieldCheck size={10} /> },
  professor: { label: 'Professor', color: 'text-accent',   bg: 'bg-accent/10 border-accent/20',   icon: <GraduationCap size={10} /> },
  aluno:     { label: 'Aluno',     color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: <Users size={10} /> },
};

const avatarColors: Record<Role, string> = {
  admin: 'bg-danger/15 text-danger border-danger/30',
  professor: 'bg-accent/15 text-accent border-accent/30',
  aluno: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

const statCards = [
  { label: 'Total de Usuários', value: '1.234', icon: <Users size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Professores Ativos', value: '48', icon: <GraduationCap size={16} />, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Administradores', value: '3', icon: <ShieldCheck size={16} />, color: 'text-danger', bg: 'bg-danger/10' },
  { label: 'Contas Suspensas', value: '7', icon: <UserX size={16} />, color: 'text-warning', bg: 'bg-warning/10' },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'todos' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleMenu = (id: string) => setOpenMenu(prev => prev === id ? null : id);

  const changeRole = (id: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    setOpenMenu(null);
  };

  const toggleSuspend = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ativo' ? 'suspenso' : 'ativo' } : u));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Usuários</h1>
          <p className="text-[#71717a] text-sm">Gerencie e edite os cargos de cada conta da plataforma.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-[#3f3f46]">
          <UserCog size={16} /> Convidar Admin
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-[#121214] border border-[#27272a] rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">{s.value}</p>
              <p className="text-[10px] text-[#71717a] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-[#27272a] flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" size={15} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              className="w-full h-9 pl-9 pr-4 bg-[#09090b] border border-[#27272a] rounded-lg text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#3f3f46] transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role filter pills */}
          <div className="flex items-center gap-1.5 ml-auto">
            {['todos', 'aluno', 'professor', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all border ${
                  roleFilter === role
                    ? 'bg-[#27272a] text-white border-[#3f3f46]'
                    : 'text-[#71717a] border-transparent hover:text-white hover:border-[#27272a]'
                }`}
              >
                {role === 'todos' ? 'Todos' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Usuário</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Cargo</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Último acesso</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Membro desde</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {filtered.map(user => {
              const rc = roleConfig[user.role as Role];
              return (
                <tr key={user.id} className="hover:bg-[#18181b] transition-colors group relative">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${avatarColors[user.role as Role]}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-none mb-0.5">{user.name}</p>
                        <p className="text-[10px] text-[#52525b]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rc.bg} ${rc.color}`}>
                      {rc.icon} {rc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#71717a]">{user.lastSeen}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ativo' ? 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]' : 'bg-[#52525b]'}`}></div>
                      <span className={`text-xs capitalize ${user.status === 'ativo' ? 'text-[#a1a1aa]' : 'text-[#52525b]'}`}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#71717a]">{user.joinedAt}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Suspend / Unsuspend */}
                      <button
                        onClick={() => toggleSuspend(user.id)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${
                          user.status === 'ativo'
                            ? 'hover:bg-danger/10 text-[#52525b] hover:text-danger'
                            : 'hover:bg-success/10 text-[#52525b] hover:text-success'
                        }`}
                        title={user.status === 'ativo' ? 'Suspender' : 'Reativar'}
                      >
                        {user.status === 'ativo' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>

                      {/* Role change dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(user.id)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 text-[#52525b] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Alterar cargo"
                        >
                          <Shield size={14} />
                        </button>

                        {openMenu === user.id && (
                          <div className="absolute right-0 top-8 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl z-50 p-1 min-w-[150px]">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Alterar cargo para</p>
                            {(['aluno', 'professor', 'admin'] as Role[]).filter(r => r !== user.role).map(r => {
                              const rc2 = roleConfig[r];
                              return (
                                <button
                                  key={r}
                                  onClick={() => changeRole(user.id, r)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[#27272a] transition-colors ${rc2.color}`}
                                >
                                  {rc2.icon} {rc2.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 text-[#52525b] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#52525b] text-sm">Nenhum usuário encontrado.</div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#27272a] flex items-center justify-between">
          <span className="text-[10px] text-[#52525b]">Mostrando <strong className="text-[#a1a1aa]">{filtered.length}</strong> de <strong className="text-[#a1a1aa]">{users.length}</strong> usuários</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] disabled:opacity-30 transition-colors">Anterior</button>
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] disabled:opacity-30 transition-colors">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};
