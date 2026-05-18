import { Shield, UserCheck, UserX, BookOpen, Settings, Eye, AlertTriangle } from 'lucide-react';

const LOGS = [
  { id: 'L001', action: 'Aprovação de professor',    target: 'Ricardo Mendes',         admin: 'Usuário Admin', time: 'Hoje, 14:30', type: 'success', icon: UserCheck },
  { id: 'L002', action: 'Curso suspenso',             target: 'Python para Dados',      admin: 'Usuário Admin', time: 'Hoje, 12:15', type: 'warning', icon: BookOpen },
  { id: 'L003', action: 'Usuário suspenso',           target: 'pedro@example.com',      admin: 'Usuário Admin', time: 'Hoje, 10:00', type: 'danger',  icon: UserX },
  { id: 'L004', action: 'Configuração alterada',      target: 'Modo de Manutenção OFF', admin: 'Usuário Admin', time: 'Ontem, 18:45', type: 'info',  icon: Settings },
  { id: 'L005', action: 'Candidatura rejeitada',      target: 'Carlos Meneses',         admin: 'Usuário Admin', time: 'Ontem, 16:30', type: 'danger', icon: UserX },
  { id: 'L006', action: 'Aprovação de professor',     target: 'Fernanda Lima',          admin: 'Usuário Admin', time: 'Ontem, 14:00', type: 'success', icon: UserCheck },
  { id: 'L007', action: 'Curso restaurado',           target: 'Node.js Avançado',       admin: 'Usuário Admin', time: 'Ontem, 11:22', type: 'success', icon: BookOpen },
  { id: 'L008', action: 'Perfil admin acessado',      target: '/admin/profile',         admin: 'Usuário Admin', time: '2 dias atrás', type: 'info',  icon: Eye },
  { id: 'L009', action: 'Login de administrador',     target: 'admin@virtulearning.com', admin: 'Sistema',      time: '3 dias atrás', type: 'info',  icon: Shield },
  { id: 'L010', action: 'Tentativa de acesso negada', target: 'pedro@example.com',      admin: 'Sistema',       time: '3 dias atrás', type: 'danger', icon: AlertTriangle },
];

const typeConfig: Record<string, { color: string; bg: string; dot: string }> = {
  success: { color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.7)]' },
  danger:  { color: 'text-danger',  bg: 'bg-danger/10 border-danger/20',   dot: 'bg-danger' },
  warning: { color: 'text-warning', bg: 'bg-warning/10 border-warning/20', dot: 'bg-warning' },
  info:    { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
};

export const AdminLogs = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Logs de Auditoria</h1>
          <p className="text-[#71717a] text-sm">Histórico completo de todas as ações administrativas.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#71717a] bg-[#121214] border border-[#27272a] px-3 py-2 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse"></div>
          Monitoramento ativo
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Ações hoje', value: 3, color: 'text-white', bg: 'bg-[#18181b] border-[#27272a]' },
          { label: 'Aprovações', value: 2, color: 'text-success', bg: 'bg-success/10 border-success/20' },
          { label: 'Suspensões', value: 2, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
          { label: 'Acessos negados', value: 1, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl px-4 py-3.5 border ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-[#71717a]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Registro de Atividades</h3>
          <button className="text-xs font-bold text-[#71717a] border border-[#27272a] px-3 py-1.5 rounded-lg hover:bg-[#27272a] transition-colors">
            Exportar CSV
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#27272a]">
              {['ID', 'Ação', 'Alvo', 'Admin', 'Tipo', 'Data'].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {LOGS.map(log => {
              const tc = typeConfig[log.type];
              const Icon = log.icon;
              return (
                <tr key={log.id} className="hover:bg-[#18181b] transition-colors">
                  <td className="px-5 py-3.5 text-[10px] font-mono text-[#52525b]">{log.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${tc.bg}`}>
                        <Icon size={12} className={tc.color} />
                      </div>
                      <span className="text-sm text-white font-medium">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#71717a] max-w-[200px] truncate">{log.target}</td>
                  <td className="px-5 py-3.5 text-xs text-[#52525b]">{log.admin}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${tc.dot}`}></div>
                      <span className={`text-[10px] font-bold capitalize ${tc.color}`}>{log.type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#52525b] whitespace-nowrap">{log.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#27272a] flex items-center justify-between">
          <span className="text-[10px] text-[#52525b]">Mostrando <strong className="text-[#a1a1aa]">10</strong> de <strong className="text-[#a1a1aa]">248</strong> registros</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] transition-colors">Anterior</button>
            <button className="px-3 py-1 text-xs border border-[#27272a] rounded-lg text-[#71717a] hover:bg-[#27272a] transition-colors">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};
