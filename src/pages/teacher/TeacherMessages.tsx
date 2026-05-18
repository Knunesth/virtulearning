import { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreVertical, Image as ImageIcon, FileText, MessageSquare } from 'lucide-react';

// Tipagem básica
type Message = {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  studentName: string;
  course: string;
  initial: string;
  color: string;
  lastActive: string;
  messages: Message[];
};

// Dados Mockados
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    studentName: 'João Silva',
    course: 'Curso Completo de React Native',
    initial: 'JS',
    color: 'bg-blue-500',
    lastActive: 'Agora',
    messages: [
      { id: 'm1', sender: 'student', text: 'Professor, estou com uma dúvida na aula de Hooks. Quando uso useEffect, ele está entrando em loop infinito.', time: '14:20' },
      { id: 'm2', sender: 'teacher', text: 'Olá João! Isso geralmente acontece se você esquecer de passar o array de dependências vazio [] no final do useEffect, ou se estiver atualizando um estado dentro dele que está no próprio array de dependências.', time: '14:25' },
      { id: 'm3', sender: 'student', text: 'Ah, entendi! Faltou o array mesmo. Muito obrigado, funcionou perfeitamente agora!', time: '14:28' }
    ]
  },
  {
    id: '2',
    studentName: 'Maria Antônia',
    course: 'UX/UI Design Masterclass',
    initial: 'M',
    color: 'bg-purple-500',
    lastActive: '15m atrás',
    messages: [
      { id: 'm1', sender: 'student', text: 'Oi prof! Qual a diferença principal entre margin e padding na hora de montar os componentes no Figma usando Auto Layout?', time: '10:00' },
      { id: 'm2', sender: 'teacher', text: 'Oi Maria. O padding é o espaço DENTRO do componente (entre a borda e o conteúdo). Margin é o espaço FORA do componente (distância para outros componentes). No Auto Layout do Figma, o padding fica nas configurações internas, e as margens geralmente são resolvidas ajustando o espaçamento (gap) entre os itens da frame pai.', time: '10:45' }
    ]
  },
  {
    id: '3',
    studentName: 'Pedro Alves',
    course: 'Introdução ao Node.js',
    initial: 'PA',
    color: 'bg-green-500',
    lastActive: '1h atrás',
    messages: [
      { id: 'm1', sender: 'student', text: 'Estou tentando rodar o projeto do módulo 3, mas o terminal diz "nodemon não é reconhecido como um comando interno". O que faço?', time: 'Ontem' }
    ]
  },
  {
    id: '4',
    studentName: 'Lucas Oliveira',
    course: 'Curso Completo de React Native',
    initial: 'L',
    color: 'bg-yellow-500',
    lastActive: 'Ontem',
    messages: [
      { id: 'm1', sender: 'student', text: 'Tem previsão de quando sai a atualização sobre Expo Router?', time: 'Ontem' },
      { id: 'm2', sender: 'teacher', text: 'E aí Lucas! Já gravei as aulas, devo publicar na plataforma até sexta-feira dessa semana.', time: 'Ontem' }
    ]
  }
];

export const TeacherMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'teacher',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    setInputText('');
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
            {conversations.map(conv => {
              const lastMessage = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeId;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 border-b border-border transition-all duration-200 text-left hover:bg-[#18181b]
                    ${isActive ? 'bg-[#18181b] border-l-2 border-l-accent' : 'border-l-2 border-l-transparent'}
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0 ${conv.color}/20 text-${conv.color.split('-')[1]}-400 border border-${conv.color.split('-')[1]}-500/30`}>
                    {conv.initial}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{conv.studentName}</p>
                      <span className="text-[10px] text-muted shrink-0">{conv.lastActive}</span>
                    </div>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider truncate mb-1">{conv.course}</p>
                    <p className="text-xs text-muted truncate">
                      {lastMessage?.sender === 'teacher' ? 'Você: ' : ''}
                      {lastMessage?.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
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
