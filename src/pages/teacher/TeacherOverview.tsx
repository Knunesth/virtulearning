export const TeacherOverview = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Painel do Professor</h1>
        <p className="text-[#a1a1aa] text-sm">Gerencie seu conteúdo e seus alunos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-[#71717a] tracking-wider uppercase mb-2">Total de Alunos</p>
          <h2 className="text-4xl font-bold text-white">0</h2>
        </div>
        
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-[#71717a] tracking-wider uppercase mb-2">Faturamento</p>
          <h2 className="text-4xl font-bold text-accent">R$ 0,00</h2>
        </div>
        
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-[#71717a] tracking-wider uppercase mb-2">Cursos Totais</p>
          <h2 className="text-4xl font-bold text-white">0</h2>
        </div>
      </div>
    </div>
  );
};
