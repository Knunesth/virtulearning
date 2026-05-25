import { useState } from 'react';
import { Search, MoreVertical, Shield, UserX, UserCheck, Users, UserCog, GraduationCap, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAdminUsers, useChangeUserRole, useChangeUserStatus, type AdminUser } from '../../hooks/useUsers';
import { useDebounce } from '../../hooks/useDebounce';

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function formatLastSeen(dateStr: string | null) {
  if (!dateStr) return 'Nunca';
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isError } = useAdminUsers({
    search: debouncedSearch || undefined,
    role: roleFilter !== 'todos' ? roleFilter : undefined,
    page,
    limit: 20,
  });

  const changeRole = useChangeUserRole();
  const changeStatus = useChangeUserStatus();

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const statCards = [
    { label: 'Total de Usuários', value: total, icon: <Users size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Professores', value: users.filter(u => u.tipo_usuario === 'professor').length, icon: <GraduationCap size={16} />, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Administradores', value: users.filter(u => u.tipo_usuario === 'admin').length, icon: <ShieldCheck size={16} />, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Suspensos', value: users.filter(u => u.status === 'suspenso').length, icon: <UserX size={16} />, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const handleChangeRole = (user: AdminUser, role: Role) => {
    changeRole.mutate({ id: user.id, role });
    setOpenMenu(null);
  };

  const handleToggleStatus = (user: AdminUser) => {
    changeStatus.mutate({
      id: user.id,
      status: user.status === 'ativo' ? 'suspenso' : 'ativo',
    });
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 md:pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Usuários</h1>
          <p className="text-[#71717a] text-sm">Gerencie e edite os cargos de cada conta da plataforma.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-[#3f3f46] w-full sm:w-auto">
          <UserCog size={16} /> Convidar Admin
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="px-5 py-4 border-b border-[#27272a] flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-1 max-w-none md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" size={15} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              className="w-full h-9 pl-9 pr-4 bg-[#09090b] border border-[#27272a] rounded-lg text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#3f3f46] transition-colors"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto md:ml-auto overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {['todos', 'aluno', 'professor', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => { setRoleFilter(role); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border whitespace-nowrap ${
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

        {/* Loading / Error */}
        {isLoading ? (
          <div className="py-16 flex justify-center items-center gap-3 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Carregando usuários...</span>
          </div>
        ) : isError ? (
          <div className="py-16 flex justify-center items-center gap-3 text-danger">
            <AlertCircle size={20} />
            <span className="text-sm">Erro ao carregar usuários. Tente novamente.</span>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
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
                {users.map((user) => {
                  const rc = roleConfig[user.tipo_usuario as Role];
                  return (
                    <tr key={user.id} className="hover:bg-[#18181b] transition-colors group relative">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${avatarColors[user.tipo_usuario as Role]}`}>
                            {user.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white leading-none mb-0.5">{user.nome}</p>
                            <p className="text-[10px] text-[#52525b]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rc.bg} ${rc.color}`}>
                          {rc.icon} {rc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a]">{formatLastSeen(user.ultimo_login)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ativo' ? 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]' : 'bg-[#52525b]'}`} />
                          <span className={`text-xs capitalize ${user.status === 'ativo' ? 'text-[#a1a1aa]' : 'text-[#52525b]'}`}>{user.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a]">{formatDate(user.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={changeStatus.isPending}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40 ${
                              user.status === 'ativo'
                                ? 'hover:bg-danger/10 text-[#52525b] hover:text-danger'
                                : 'hover:bg-success/10 text-[#52525b] hover:text-success'
                            }`}
                            title={user.status === 'ativo' ? 'Suspender' : 'Reativar'}
                          >
                            {user.status === 'ativo' ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu((prev) => prev === String(user.id) ? null : String(user.id))}
                              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 text-[#52525b] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                              title="Alterar cargo"
                            >
                              <Shield size={14} />
                            </button>

                            {openMenu === String(user.id) && (
                              <div className="absolute right-0 top-8 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl z-50 p-1 min-w-[150px]">
                                <p className="px-3 py-1.5 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">Alterar cargo para</p>
                                {(['aluno', 'professor', 'admin'] as Role[])
                                  .filter((r) => r !== user.tipo_usuario)
                                  .map((r) => {
                                    const rc2 = roleConfig[r];
                                    return (
                                      <button
                                        key={r}
                                        onClick={() => handleChangeRole(user, r)}
                                        disabled={changeRole.isPending}
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
          </div>

            {users.length === 0 && (
              <div className="py-16 text-center text-[#52525b] text-sm">Nenhum usuário encontrado.</div>
            )}

            {/* Footer / Paginação */}
            <div className="px-5 py-3 border-t border-[#27272a] flex items-center justify-between">
              <span className="text-[10px] text-[#52525b]">
                Mostrando <strong className="text-[#a1a1aa]">{users.length}</strong> de <strong className="text-[#a1a1aa]">{total}</strong> usuários
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] disabled:opacity-30 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-xs text-[#71717a]">{page}/{pages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] disabled:opacity-30 transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
