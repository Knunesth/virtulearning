import { useState } from 'react';
import { Trophy, Crown, Flame, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useRanking } from '../../hooks/useRanking';
import { useAuthStore } from '../../store/useAuthStore';

export const Ranking = () => {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();
  const { data, isLoading } = useRanking(page, 20);

  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-accent mb-4" size={48} />
        <p className="text-muted">Carregando ranking global...</p>
      </div>
    );
  }

  if (!data) return null;

  const currentRanking = data.data;
  const top3 = currentRanking.slice(0, 3);
  const rest = currentRanking.slice(3);

  const getAvatarLetter = (nome: string) => nome ? nome.charAt(0).toUpperCase() : 'U';

  const myUserInList = currentRanking.find((u: any) => u.id === user?.id);
  // O backend retorna currentUserPosition. Podemos usar para mostrar a posição do user atual.
  
  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <header className="mb-10 text-center">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} />
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Ranking Global</h1>
        <p className="text-muted max-w-lg mx-auto">
          Complete cursos, faça quizzes e ganhe XP. Mostre que você é o melhor e conquiste o topo do pódio!
        </p>
      </header>

      {/* Meus Status */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-14 h-14 bg-accent text-black font-bold text-xl rounded-full flex items-center justify-center ring-4 ring-accent/20">
            {getAvatarLetter(user?.nome || '')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.nome}</h2>
            <p className="text-sm text-accent font-medium flex items-center gap-1">
              <Flame size={14} /> Minha Posição: {data.currentUserPosition ? `#${data.currentUserPosition}` : 'Não rankeado'}
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <p className="text-muted text-xs uppercase tracking-wider mb-1">XP Global</p>
            <p className="text-2xl font-black text-white">{myUserInList ? myUserInList.xp.toLocaleString() : (user as any)?.xp || 0}</p>
          </div>
        </div>
      </div>

      {page === 1 && top3.length > 0 && (
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-16 mt-8 pt-10">
          
          {/* 2º Lugar */}
          {top3[1] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 border-4 ${top3[1].id === user?.id ? 'bg-accent text-black border-white' : 'bg-bg text-white border-slate-300'}`}>
                {getAvatarLetter(top3[1].nome)}
              </div>
              <p className={`font-bold text-sm mb-1 ${top3[1].id === user?.id ? 'text-accent' : 'text-white'}`}>{top3[1].nome}</p>
              <p className="text-xs text-muted mb-4">{top3[1].xp.toLocaleString()} XP</p>
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
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-4 ${top3[0].id === user?.id ? 'bg-accent text-black border-white ring-4 ring-accent/30' : 'bg-bg text-white border-accent ring-4 ring-accent/30'}`}>
                {getAvatarLetter(top3[0].nome)}
              </div>
              <p className={`font-bold text-base mb-1 ${top3[0].id === user?.id ? 'text-accent' : 'text-white'}`}>{top3[0].nome}</p>
              <p className="text-sm text-accent font-bold mb-4">{top3[0].xp.toLocaleString()} XP</p>
              <div className="w-28 h-40 bg-gradient-to-t from-[#09090b] to-accent/20 rounded-t-xl border-t-4 border-accent flex justify-center pt-4 relative overflow-hidden shadow-[0_-10px_40px_-15px_rgba(255,215,0,0.3)]">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                 <span className="text-4xl font-black text-accent drop-shadow-lg">1</span>
              </div>
            </div>
          )}

          {/* 3º Lugar */}
          {top3[2] && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-3 border-4 ${top3[2].id === user?.id ? 'bg-accent text-black border-white' : 'bg-bg text-white border-orange-700'}`}>
                {getAvatarLetter(top3[2].nome)}
              </div>
              <p className={`font-bold text-sm mb-1 ${top3[2].id === user?.id ? 'text-accent' : 'text-white'}`}>{top3[2].nome}</p>
              <p className="text-xs text-muted mb-4">{top3[2].xp.toLocaleString()} XP</p>
              <div className="w-24 h-24 bg-gradient-to-t from-[#09090b] to-[#7c2d12] rounded-t-xl border-t-4 border-orange-700 flex justify-center pt-4 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                 <span className="text-3xl font-black text-orange-500 drop-shadow-md">3</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista do Restante (ou tudo se não for pag 1) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in duration-700 delay-300 mb-8">
        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-bg/50">
          <div className="col-span-2 text-center">Posição</div>
          <div className="col-span-7">Aluno</div>
          <div className="col-span-3 text-right">XP</div>
        </div>

        <div className="divide-y divide-border">
          {(page === 1 ? rest : currentRanking).map((student: any, index: number) => {
            const isMe = student.id === user?.id;
            const rankPos = page === 1 ? index + 4 : ((page - 1) * 20) + index + 1;
            
            return (
              <div key={student.id} className={`flex md:grid md:grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-bg/50 ${isMe ? 'bg-accent/5' : ''}`}>
                <div className="flex-shrink-0 md:col-span-2 text-center font-bold text-muted text-lg min-w-[3rem]">
                  #{rankPos}
                </div>
                <div className="flex-1 md:col-span-7 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isMe ? 'bg-accent text-black' : 'bg-border text-muted'}`}>
                    {getAvatarLetter(student.nome)}
                  </div>
                  <span className={`font-medium truncate max-w-[120px] sm:max-w-none ${isMe ? 'text-accent font-bold' : 'text-white'}`}>
                    {student.nome} {isMe && '(Você)'}
                  </span>
                </div>
                <div className="flex-shrink-0 md:col-span-3 text-right font-medium text-white">
                  {student.xp.toLocaleString()} <span className="md:hidden text-muted text-xs ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Anterior
        </button>
        <span className="text-muted text-sm font-bold">
          Página {data.page} de {data.totalPages} (Total: {data.total})
        </span>
        <button 
          disabled={page >= data.totalPages}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-bg rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};
