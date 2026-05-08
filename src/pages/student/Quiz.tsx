import { useState, useEffect } from 'react';
import { BrainCircuit, Clock, CheckCircle2, XCircle, ChevronRight, Play, AlertCircle, History, Trophy } from 'lucide-react';
import type { QuizQuestion } from '../../config/quizPrompt';

// Mock Courses for Quiz
const AVAILABLE_COURSES = [
  { id: 'c1', name: 'Bootcamp React Native', lastTaken: null }, // Available
  { id: 'c2', name: 'UX/UI Design', lastTaken: new Date().getTime() - (1000 * 60 * 60 * 2) }, // Taken 2h ago (Cooldown)
];

// Mock History
const MOCK_QUIZ_HISTORY = [
  { id: 'h1', courseName: 'Masterizando React e Next.js', date: '05/05/2026', score: '5/5', xp: 250 },
  { id: 'h2', courseName: 'Fundamentos de DevOps', date: '02/05/2026', score: '4/5', xp: 200 },
];

// Mock Quiz generated via the AI prompt structure
const MOCK_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Qual componente do React Native é utilizado para criar uma lista com rolagem eficiente (renderizando apenas itens visíveis)?',
    options: [
      { id: 'a', text: 'ScrollView' },
      { id: 'b', text: 'FlatList' },
      { id: 'c', text: 'ListView' },
      { id: 'd', text: 'RecyclerList' }
    ],
    correctOptionId: 'b',
    explanation: 'O FlatList renderiza os itens de forma "preguiçosa" (lazy), removendo componentes que saem da tela para economizar memória.'
  },
  {
    id: 'q2',
    text: 'Como aplicamos estilos no React Native sem usar arquivos CSS externos?',
    options: [
      { id: 'a', text: 'Usando a tag <style>' },
      { id: 'b', text: 'Através de classes do Tailwind (sem bibliotecas extras)' },
      { id: 'c', text: 'Com a API StyleSheet.create()' },
      { id: 'd', text: 'Criando arquivos .scss e importando-os' }
    ],
    correctOptionId: 'c',
    explanation: 'A maneira padrão e otimizada de estilizar no React Native é usando a API nativa StyleSheet.create().'
  }
];

export const Quiz = () => {
  const [step, setStep] = useState<'selection' | 'playing' | 'results'>('selection');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  
  const question = MOCK_QUIZ[currentQuestionIndex];
  
  const handleStartQuiz = (courseId: string) => {
    setSelectedCourse(courseId);
    setStep('playing');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowExplanation(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return; // Prevent changing answer after confirming
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = () => {
    if (!showExplanation) {
      // First click: Confirm answer, show explanation
      setShowExplanation(true);
    } else {
      // Second click: Next question or Results
      if (currentQuestionIndex < MOCK_QUIZ.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowExplanation(false);
      } else {
        setStep('results');
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    MOCK_QUIZ.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    return correct;
  };

  const renderSelection = () => (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {AVAILABLE_COURSES.map(course => {
          const isOnCooldown = course.lastTaken && (new Date().getTime() - course.lastTaken) < (1000 * 60 * 60 * 24);
          
          return (
            <div key={course.id} className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:border-accent/50 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                <p className="text-sm text-muted mb-6">Responda perguntas geradas dinamicamente sobre este curso e ganhe até 100 XP.</p>
              </div>
              
              {isOnCooldown ? (
                <div className="flex items-center justify-between bg-bg rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2 text-warning text-yellow-500 text-sm font-medium">
                    <Clock size={16} /> Em Cooldown
                  </div>
                  <span className="text-xs text-muted">Aguarde 22h</span>
                </div>
              ) : (
                <button 
                  onClick={() => handleStartQuiz(course.id)}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors"
                >
                  <Play size={16} /> Iniciar Quiz Agora
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Histórico Section */}
      <div className="mt-16 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-2 mb-6">
          <History className="text-accent" size={24} />
          <h2 className="text-2xl font-bold text-white">Histórico de Quizzes</h2>
        </div>
        
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-bg/50 hidden md:grid">
            <div className="col-span-12 md:col-span-5">Curso</div>
            <div className="col-span-12 md:col-span-3 text-center">Data</div>
            <div className="col-span-12 md:col-span-2 text-center">Acertos</div>
            <div className="col-span-12 md:col-span-2 text-right">XP Ganho</div>
          </div>

          <div className="divide-y divide-border">
            {MOCK_QUIZ_HISTORY.map(history => (
              <div key={history.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg/50 transition-colors">
                <div className="col-span-12 md:col-span-5 font-bold text-white text-base md:text-sm">
                  {history.courseName}
                </div>
                <div className="col-span-4 md:col-span-3 text-left md:text-center text-muted text-sm flex items-center gap-2 md:block">
                  <span className="md:hidden text-xs uppercase font-bold">Data:</span>
                  {history.date}
                </div>
                <div className="col-span-4 md:col-span-2 text-center font-medium text-white flex items-center gap-2 md:block">
                  <span className="md:hidden text-xs uppercase font-bold text-muted">Acertos:</span>
                  {history.score}
                </div>
                <div className="col-span-4 md:col-span-2 text-right font-bold text-accent flex items-center justify-end gap-1">
                  <Trophy size={14} /> +{history.xp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderPlaying = () => {
    const hasAnswered = !!answers[question.id];
    const isCorrect = answers[question.id] === question.correctOptionId;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 text-sm font-bold text-muted uppercase tracking-wider">
          <span>Pergunta {currentQuestionIndex + 1} de {MOCK_QUIZ.length}</span>
          <span className="text-accent border border-accent/20 bg-accent/10 px-3 py-1 rounded-full">
            Curso React Native
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map(option => {
              const isSelected = answers[question.id] === option.id;
              const isThisCorrect = option.id === question.correctOptionId;
              
              let styleClass = "bg-bg border-border text-muted hover:border-accent/50 hover:text-white";
              
              if (showExplanation) {
                if (isThisCorrect) {
                  styleClass = "bg-success/10 border-success text-success";
                } else if (isSelected && !isThisCorrect) {
                  styleClass = "bg-danger/10 border-danger text-danger";
                } else {
                  styleClass = "bg-bg border-border opacity-50 text-muted";
                }
              } else if (isSelected) {
                styleClass = "bg-accent/10 border-accent text-white";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={showExplanation}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${styleClass}`}
                >
                  <span className="font-medium text-sm md:text-base">{option.text}</span>
                  {showExplanation && isThisCorrect && <CheckCircle2 size={20} className="text-success shrink-0 ml-2" />}
                  {showExplanation && isSelected && !isThisCorrect && <XCircle size={20} className="text-danger shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className={`p-5 rounded-xl mb-6 border flex gap-4 items-start animate-in slide-in-from-top-4 ${isCorrect ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
            <AlertCircle className={`shrink-0 mt-0.5 ${isCorrect ? 'text-success' : 'text-danger'}`} size={20} />
            <div>
              <p className={`font-bold mb-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                {isCorrect ? 'Correto! Excelente trabalho.' : 'Incorreto. Vamos aprender:'}
              </p>
              <p className="text-sm text-white/80 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!hasAnswered}
            className="flex items-center gap-2 bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accentHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showExplanation ? (currentQuestionIndex === MOCK_QUIZ.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta') : 'Confirmar Resposta'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const isPerfect = score === MOCK_QUIZ.length;
    const xpGained = score * 50; // 50 XP per correct answer

    return (
      <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit size={48} className="text-accent" />
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2">Quiz Concluído!</h2>
        <p className="text-muted mb-8">Você testou seus conhecimentos com sucesso.</p>

        <div className="bg-bg border border-border rounded-xl p-6 mb-8">
          <p className="text-4xl font-black text-white mb-2">{score}/{MOCK_QUIZ.length}</p>
          <p className="text-sm text-muted uppercase tracking-wider font-bold mb-4">Acertos</p>
          
          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden mb-6">
            <div className="h-full bg-accent" style={{ width: `${(score / MOCK_QUIZ.length) * 100}%` }}></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xl font-bold text-accent">
            +{xpGained} XP
          </div>
          {isPerfect && <p className="text-xs text-success mt-2">Bônus de perfeição aplicado!</p>}
        </div>

        <button 
          onClick={() => setStep('selection')}
          className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors"
        >
          Voltar para Quizzes
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-10">
      {step === 'selection' && (
        <>
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-3">Quiz de Fixação</h1>
            <p className="text-muted max-w-lg mx-auto">
              Ganhe XP e consolide seu conhecimento respondendo perguntas geradas por Inteligência Artificial sobre os cursos que você já assistiu.
            </p>
          </header>
          {renderSelection()}
        </>
      )}

      {step === 'playing' && renderPlaying()}
      {step === 'results' && renderResults()}
    </div>
  );
};
