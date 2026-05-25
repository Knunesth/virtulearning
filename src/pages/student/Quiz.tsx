import { useState } from 'react';
import { BrainCircuit, CheckCircle2, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuiz } from '../../hooks/useQuiz';
import { useMyEnrollments } from '../../hooks/useEnrollments';

const CourseSelectionView = () => {
  const { data, isLoading } = useMyEnrollments(1, 50);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const enrollments = data?.data || [];

  if (enrollments.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto text-center p-10 pt-20">
        <h2 className="text-xl font-bold text-white mb-4">Você ainda não está matriculado em nenhum curso.</h2>
        <Link to="/catalog" className="px-6 py-3 bg-accent text-bg font-bold rounded-xl hover:scale-105 transition-all inline-block mt-4">Explorar Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 animate-in fade-in pb-20">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent border border-accent/20">
          <BrainCircuit size={32} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Quiz de Fixação</h2>
        <p className="text-muted">Selecione um dos seus cursos abaixo para testar seus conhecimentos.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((e: any) => (
          <Link 
            key={e.curso_id} 
            to={`?courseId=${e.curso_id}`}
            className="bg-card/40 backdrop-blur-md border border-white/5 hover:border-accent/50 rounded-3xl p-5 flex flex-col gap-4 group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:-translate-y-1"
          >
            <div className="w-full h-40 bg-bg rounded-2xl overflow-hidden relative">
              {e.curso.thumbnail ? (
                <img src={e.curso.thumbnail} alt={e.curso.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center">
                   <BrainCircuit size={40} className="text-accent/40" />
                </div>
              )}
              {e.progresso === 100 && (
                <div className="absolute top-3 right-3 bg-success text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <CheckCircle2 size={12} /> Concluído
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-[10px] font-bold text-accent tracking-widest uppercase mb-1">{e.curso.nivel}</p>
              <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-accent transition-colors mb-4">{e.curso.titulo}</h3>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                 <div className="flex items-center gap-2 flex-1 mr-4">
                   <div className="w-full bg-bg h-1.5 rounded-full overflow-hidden">
                     <div className="bg-accent h-full rounded-full" style={{ width: `${e.progresso}%` }} />
                   </div>
                   <span className="text-[10px] text-muted font-bold">{e.progresso}%</span>
                 </div>
                 <div className="text-accent group-hover:translate-x-1 transition-transform shrink-0">
                   <ChevronRight size={18} />
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Quiz = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { quiz, submitAttempt } = useQuiz(courseId || '');

  const [step, setStep] = useState<'playing' | 'results'>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);

  if (!courseId) {
    return <CourseSelectionView />;
  }

  if (quiz.isLoading) {
    return <div className="text-center p-20 text-white animate-pulse">Carregando quiz...</div>;
  }

  if (!quiz.data || quiz.data.questions?.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto text-center p-10 pt-20">
        <h2 className="text-xl font-bold text-white mb-4">Nenhum quiz disponível para este curso.</h2>
        <Link to={`/courses/${courseId}`} className="text-accent underline hover:text-white transition-colors">Voltar para o curso</Link>
      </div>
    );
  }

  const questions = quiz.data.questions;
  const question = questions[currentQuestionIndex];

  const handleSelectOption = (optionId: number) => {
    if (submitAttempt.isPending) return;
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Enviar
      const attemptData = Object.keys(answers).map(qId => ({
        questionId: parseInt(qId),
        optionId: answers[parseInt(qId)]
      }));
      
      try {
        const res = await submitAttempt.mutateAsync({
          quizId: quiz.data.id,
          answers: attemptData
        });
        setResult(res);
        setStep('results');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const hasAnswered = !!answers[question.id];

  const renderPlaying = () => (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 text-sm font-bold text-muted uppercase tracking-wider">
          <Link to={`/courses/${courseId}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
          <span className="text-accent border border-accent/20 bg-accent/10 px-3 py-1 rounded-full">
            {quiz.data.titulo}
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
            {question.texto}
          </h2>

          <div className="space-y-3">
            {question.options.map((option: any) => {
              const isSelected = answers[question.id] === option.id;
              let styleClass = "bg-bg border-border text-muted hover:border-accent/50 hover:text-white";
              
              if (isSelected) {
                styleClass = "bg-accent/10 border-accent text-white";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${styleClass}`}
                >
                  <span className="font-medium text-sm md:text-base">{option.texto}</span>
                  {isSelected && <CheckCircle2 size={20} className="text-accent shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!hasAnswered || submitAttempt.isPending}
            className="flex items-center gap-2 bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accentHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitAttempt.isPending ? 'Enviando...' : (currentQuestionIndex === questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Pergunta')}
            {!submitAttempt.isPending && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
  );

  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit size={48} className="text-accent" />
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2">
          {result.passed ? 'Quiz Concluído!' : 'Tente Novamente!'}
        </h2>
        <p className="text-muted mb-8">
          {result.passed ? 'Você testou seus conhecimentos com sucesso.' : `Você precisa de ${quiz.data.passingScore}% para passar.`}
        </p>

        <div className="bg-bg border border-border rounded-xl p-6 mb-8">
          <p className="text-4xl font-black text-white mb-2">{result.score}%</p>
          <p className="text-sm text-muted uppercase tracking-wider font-bold mb-4">
            Acertos: {result.correctCount} de {result.totalQuestions}
          </p>
          
          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden mb-6">
            <div className={`h-full ${result.passed ? 'bg-success' : 'bg-danger'}`} style={{ width: `${result.score}%` }}></div>
          </div>

          {result.passed && (
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-accent">
              <Trophy size={20} /> +50 XP
            </div>
          )}
        </div>

        <Link 
          to={`/courses/${courseId}`}
          className="w-full flex items-center justify-center bg-accent text-black font-bold py-3 rounded-lg hover:bg-accentHover transition-colors"
        >
          Voltar para o Curso
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-10 pt-10">
      {step === 'playing' && renderPlaying()}
      {step === 'results' && renderResults()}
    </div>
  );
};
