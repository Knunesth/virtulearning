import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useState } from 'react';

export const TeacherMessages = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pendente' | 'respondida' | 'fechada'>('pendente');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-messages', activeTab],
    queryFn: async () => {
      const res = await api.get(`/messages?status=${activeTab}`);
      return res.data;
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, resposta }: { id: number; resposta: string }) => {
      await api.patch(`/messages/${id}/reply`, { resposta });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-messages'] });
      setSelectedMessage(null);
      setReplyText('');
    },
  });

  const closeMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/messages/${id}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-messages'] });
    },
  });

  const messages = data?.data ?? [];

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 md:pb-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dúvidas dos Alunos</h1>
        <p className="text-muted mt-1 text-sm md:text-base">Responda as perguntas dos seus alunos.</p>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-card border border-border rounded-xl p-1 w-full sm:w-fit [&::-webkit-scrollbar]:hidden">
        {(['pendente', 'respondida', 'fechada'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 md:p-10 text-center">
          <MessageSquare className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
          <p className="text-white font-bold mb-1">Nenhuma dúvida {activeTab}</p>
          <p className="text-muted text-sm">Quando alunos enviarem perguntas, elas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-accent/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{msg.aluno?.nome ?? 'Aluno'}</span>
                    <span className="text-xs text-muted">em</span>
                    <span className="text-xs text-accent font-medium truncate max-w-[200px] sm:max-w-xs">{msg.curso?.titulo}</span>
                  </div>
                  <p className="text-sm text-text leading-relaxed">{msg.mensagem}</p>
                  {msg.resposta && (
                    <div className="mt-3 pl-3 border-l-2 border-accent/30 bg-bg/50 p-2 rounded-r-lg">
                      <p className="text-xs text-muted mb-1">Sua resposta:</p>
                      <p className="text-sm text-text">{msg.resposta}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-2 shrink-0 pt-3 sm:pt-0 border-t border-border sm:border-none">
                  <span className={`text-[10px] md:text-xs font-bold px-2 py-1 sm:py-0.5 rounded-full flex items-center gap-1 ${msg.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-400' : msg.status === 'respondida' ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted'}`}>
                    {msg.status === 'pendente' && <Clock size={10} />}
                    {msg.status === 'respondida' && <CheckCircle size={10} />}
                    {msg.status === 'fechada' && <XCircle size={10} />}
                    {msg.status}
                  </span>
                  <div className="flex gap-2 sm:gap-1">
                    {msg.status === 'pendente' && (
                      <button onClick={() => { setSelectedMessage(msg); setReplyText(''); }} className="text-xs px-3 py-1.5 bg-accent/10 text-accent rounded-lg font-bold hover:bg-accent/20 transition-colors">
                        Responder
                      </button>
                    )}
                    {msg.status !== 'fechada' && (
                      <button onClick={() => closeMutation.mutate(msg.id)} className="text-xs px-3 py-1.5 bg-white/5 text-muted rounded-lg hover:text-white hover:bg-white/10 transition-colors">
                        Fechar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de resposta */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <h3 className="text-white font-bold text-lg mb-2">Responder Dúvida</h3>
            <p className="text-sm text-muted mb-4 bg-bg rounded-lg p-3 max-h-32 overflow-y-auto">{selectedMessage.mensagem}</p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva sua resposta..."
              className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent resize-none mb-4"
              rows={4}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setSelectedMessage(null)} className="flex-1 py-2.5 rounded-xl border border-border text-white hover:bg-white/5 font-bold text-sm transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => replyMutation.mutate({ id: selectedMessage.id, resposta: replyText })}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-accent text-black font-bold hover:bg-accentHover transition-colors disabled:opacity-50 text-sm"
              >
                {replyMutation.isPending ? 'Enviando...' : 'Enviar Resposta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
