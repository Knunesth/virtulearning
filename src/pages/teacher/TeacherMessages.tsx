import { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreVertical, Image as ImageIcon, FileText, MessageSquare } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';

// Tipagem básica
type Message = {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  time: string;
};



// Dados Mockados


export const TeacherMessages = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMessages(page, 10);
  
  const conversations = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const [activeId, setActiveId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = activeId ? {
    studentName: 'Aluno', // Mock until thread query is implemented
    course: 'Curso',
    initial: 'A',
    color: 'bg-blue-500',
    messages: [] as Message[]
  } : null;

  // We are treating conversations from backend. Active conversation messages should be fetched by thread id ideally,
  // but for now we just get the one from the list (which only contains the last message currently, wait no, 
  // the backend query `findMany` over `message` with `distinct` just returns the LATEST message per conversation!)
  // So the UI needs a separate query for the thread messages.
  // We'll leave the thread messages as a generic "Mensagens" for now, or just show the active one from list.
  // Since we don't have the full thread in this component (it's mocked originally), I'll just adapt the left list
  // and leave the right panel generic or fetch the thread if the user clicks. The prompt says "Atualizar hook de mensagens (useMessages ou similar) com a mesma lógica". I will just add pagination to the list.



  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      // setActiveId(`${conversations[0].aluno_id}-${conversations[0].professor_id}`);
    }
  }, [conversations]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setInputText('');
    // TODO: Connect to POST /messages
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dúvidas dos Alunos</h1>
        <p className="text-muted text-sm">Responda dúvidas e interaja com seus alunos em tempo real.</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card border border-border rounded-2xl shadow-lg shadow-black/20 overflow-hidden flex flex-col md:flex-row">
        
        {/* Coluna Esquerda: Lista de Conversas (30%) */}
        <div className="w-full md:w-[320px] border-r border-border flex flex-col bg-bg shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Buscar aluno ou curso..." 
                className="w-full h-10 pl-9 pr-4 bg-[#09090b] border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent/50 shadow-inner"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted">Carregando conversas...</div>
            ) : conversations.length > 0 ? (
              conversations.map((msg: any) => {
                const convId = `${msg.aluno_id}-${msg.professor_id}`;
                const isActive = convId === activeId;
                const studentName = msg.remetente?.nome || 'Aluno';
                
                return (
                  <button
                    key={convId}
                    onClick={() => setActiveId(convId)}
                    className={`w-full flex items-start gap-3 p-4 border-b border-border transition-all duration-200 text-left hover:bg-[#18181b]
                      ${isActive ? 'bg-[#18181b] border-l-2 border-l-accent' : 'border-l-2 border-l-transparent'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0 bg-blue-500/20 text-blue-400 border border-blue-500/30`}>
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{studentName}</p>
                        <span className="text-[10px] text-muted shrink-0">Recente</span>
                      </div>
                      <p className="text-xs text-muted truncate">
                        {msg.sender === 'teacher' ? 'Você: ' : ''}
                        {msg.texto}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted">Nenhuma conversa encontrada.</div>
            )}
          </div>
          
          {/* Paginação da Lista */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-border flex justify-between items-center bg-[#09090b]">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="text-xs text-muted hover:text-white disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-xs text-muted font-bold">
                {page} / {totalPages}
              </span>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="text-xs text-muted hover:text-white disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        {/* Coluna Direita: Área de Chat (70%) */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-[#09090b] relative">
            {/* Chat Header */}
            <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0 ${activeConversation.color}/20 text-${activeConversation.color.split('-')[1]}-400 border border-${activeConversation.color.split('-')[1]}-500/30`}>
                  {activeConversation.initial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeConversation.studentName}</h3>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{activeConversation.course}</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeConversation.messages.map((msg) => {
                const isTeacher = msg.sender === 'teacher';
                return (
                  <div key={msg.id} className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isTeacher && (
                        <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-[10px] text-white shadow-inner ${activeConversation.color}/20 text-${activeConversation.color.split('-')[1]}-400 border border-${activeConversation.color.split('-')[1]}-500/30 mb-1`}>
                          {activeConversation.initial}
                        </div>
                      )}
                      
                      <div className={`
                        px-4 py-3 rounded-2xl shadow-sm text-sm
                        ${isTeacher 
                          ? 'bg-accent/10 border border-accent/20 text-white rounded-br-sm' 
                          : 'bg-card border border-border text-gray-200 rounded-bl-sm'}
                      `}>
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted mt-1 px-10">{msg.time}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex flex-shrink-0 items-center justify-center text-muted hover:text-white transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex flex-shrink-0 items-center justify-center text-muted hover:text-white transition-colors">
                  <FileText size={20} />
                </button>
                <div className="flex-1 relative">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite sua resposta..."
                      className="w-full bg-[#09090b] border border-border focus:border-accent/50 rounded-xl px-4 py-3 text-sm text-white resize-none shadow-inner min-h-[44px] max-h-32 focus:outline-none"
                      rows={1}
                    />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="h-[44px] px-4 rounded-xl bg-accent text-black font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20 flex-shrink-0"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted bg-[#09090b]">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Selecione uma conversa para começar a responder.</p>
          </div>
        )}

      </div>
    </div>
  );
};
