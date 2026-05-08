import { useState } from 'react';
import { Trophy, Crown, Flame, Star, Medal, ArrowUpRight, ArrowDownRight, Minus, Users, Globe } from 'lucide-react';

const MOCK_GLOBAL_RANKING = [
  { id: 1, name: 'Alice Silva', xp: 12450, avatar: 'A', trend: 'up' },
  { id: 2, name: 'Kaua Nunes', xp: 11200, avatar: 'K', trend: 'same', isMe: true }, 
  { id: 3, name: 'Bruno Costa', xp: 10800, avatar: 'B', trend: 'down' },
  { id: 4, name: 'Carlos Santos', xp: 9500, avatar: 'C', trend: 'up' },
  { id: 5, name: 'Diana Lima', xp: 8200, avatar: 'D', trend: 'same' },
  { id: 6, name: 'Eduardo Alves', xp: 7100, avatar: 'E', trend: 'down' },
  { id: 7, name: 'Fernanda Rocha', xp: 6800, avatar: 'F', trend: 'up' },
];

const MOCK_LOCAL_RANKING = [
  { id: 2, name: 'Kaua Nunes', xp: 5400, avatar: 'K', trend: 'up', isMe: true }, 
  { id: 8, name: 'Gustavo Dias', xp: 5200, avatar: 'G', trend: 'down' },
  { id: 9, name: 'Helena Mendes', xp: 4800, avatar: 'H', trend: 'same' },
  { id: 10, name: 'Igor Silva', xp: 4100, avatar: 'I', trend: 'up' },
  { id: 11, name: 'Julia Costa', xp: 3900, avatar: 'J', trend: 'down' },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <ArrowUpRight size={16} className="text-success" />;
  if (trend === 'down') return <ArrowDownRight size={16} className="text-danger" />;
  return <Minus size={16} className="text-muted" />;
};

export const Ranking = () => {
  const [filter, setFilter] = useState<'global' | 'local'>('global');
  
  const currentRanking = filter === 'global' ? MOCK_GLOBAL_RANKING : MOCK_LOCAL_RANKING;
  const top3 = currentRanking.slice(0, 3);
  const rest = currentRanking.slice(3);

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <header className="mb-10 text-center">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} />
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Ranking de Alunos</h1>
        <p className="text-muted max-w-lg mx-auto">
          Complete cursos, faça quizzes e ganhe XP. Mostre que você é o melhor e conquiste o topo do pódio!
        </p>
      </header>

      {/* Meus Status */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-14 h-14 bg-accent text-black font-bold text-xl rounded-full flex items-center justify-center ring-4 ring-accent/20">
            K
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kaua Nunes</h2>
            <p className="text-sm text-accent font-medium flex items-center gap-1">
              <Flame size={14} /> Nível 15 - Mestre Front-end
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <p className="text-muted text-xs uppercase tracking-wider mb-1">XP Global</p>
            <p className="text-2xl font-black text-white">11.200</p>
          </div>
          <div className="w-px bg-border"></div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wider mb-1">XP Turma</p>
            <p className="text-2xl font-black text-white">5.400</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#121214] p-1 rounded-xl border border-border inline-flex shadow-sm">
          <button 
            onClick={() => setFilter('global')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'global' ? 'bg-accent text-black shadow-md' : 'text-muted hover:text-white'}`}
          >
            <Globe size={16} /> Global
          </button>
          <button 
            onClick={() => setFilter('local')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'local' ? 'bg-accent text-black shadow-md' : 'text-muted hover:text-white'}`}
          >
            <Users size={16} /> Minha Turma
          </button>
        </div>
      </div>

      {/* Pódio (Top 3) */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-16 mt-8 pt-10">
        
        {/* 2º Lugar */}
        {top3[1] && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 border-4 ${top3[1].isMe ? 'bg-accent text-black border-white' : 'bg-bg text-white border-slate-300'}`}>
              {top3[1].avatar}
            </div>
            <p className={`font-bold text-sm mb-1 ${top3[1].isMe ? 'text-accent' : 'text-white'}`}>{top3[1].name}</p>
            <p className="text-xs text-muted mb-4">{top3[1].xp} XP</p>
            <div className="w-24 h-32 bg-gradient-to-t from-[#09090b] to-slate-800 rounded-t-xl border-t-4 border-slate-400 flex justify-center pt-4 relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
               <span className="text-3xl font-black text-slate-400 drop-shadow-md">2</span>
            </div>
          </div>
        )}

        {/* 1º Lugar */}
        {top3[0] && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
            <Crown size={32} className="text-accent mb-2 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-4 ${top3[0].isMe ? 'bg-accent text-black border-white ring-4 ring-accent/30' : 'bg-bg text-white border-accent ring-4 ring-accent/30'}`}>
              {top3[0].avatar}
            </div>
            <p className={`font-bold text-base mb-1 ${top3[0].isMe ? 'text-accent' : 'text-white'}`}>{top3[0].name}</p>
            <p className="text-sm text-accent font-bold mb-4">{top3[0].xp} XP</p>
            <div className="w-28 h-40 bg-gradient-to-t from-[#09090b] to-accent/20 rounded-t-xl border-t-4 border-accent flex justify-center pt-4 relative overflow-hidden shadow-[0_-10px_40px_-15px_rgba(255,215,0,0.3)]">
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
               <span className="text-4xl font-black text-accent drop-shadow-lg">1</span>
            </div>
          </div>
        )}

        {/* 3º Lugar */}
        {top3[2] && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-3 border-4 ${top3[2].isMe ? 'bg-accent text-black border-white' : 'bg-bg text-white border-orange-700'}`}>
              {top3[2].avatar}
            </div>
            <p className={`font-bold text-sm mb-1 ${top3[2].isMe ? 'text-accent' : 'text-white'}`}>{top3[2].name}</p>
            <p className="text-xs text-muted mb-4">{top3[2].xp} XP</p>
            <div className="w-24 h-24 bg-gradient-to-t from-[#09090b] to-[#7c2d12] rounded-t-xl border-t-4 border-orange-700 flex justify-center pt-4 relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
               <span className="text-3xl font-black text-orange-500 drop-shadow-md">3</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista do Restante */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in duration-700 delay-300">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-bg/50">
          <div className="col-span-2 text-center">Posição</div>
          <div className="col-span-6">Aluno</div>
          <div className="col-span-3 text-right">XP</div>
          <div className="col-span-1 text-center"></div>
        </div>

        <div className="divide-y divide-border">
          {rest.map((student, index) => (
            <div key={student.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-bg/50 ${student.isMe ? 'bg-accent/5' : ''}`}>
              <div className="col-span-2 text-center font-bold text-muted text-lg">
                #{index + 4}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.isMe ? 'bg-accent text-black' : 'bg-border text-muted'}`}>
                  {student.avatar}
                </div>
                <span className={`font-medium ${student.isMe ? 'text-accent font-bold' : 'text-white'}`}>
                  {student.name} {student.isMe && '(Você)'}
                </span>
              </div>
              <div className="col-span-3 text-right font-medium text-white">
                {student.xp.toLocaleString()}
              </div>
              <div className="col-span-1 flex justify-center">
                <TrendIcon trend={student.trend} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
