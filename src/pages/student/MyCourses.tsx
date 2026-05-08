import { useState } from 'react';
import { BookOpen, Trophy, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { CourseCard } from '../../components/ui/CourseCard';

// Mock data for enrolled courses
const ENROLLED_COURSES = [
  {
    id: '1',
    title: 'Bootcamp React Native do Zero ao Profissional',
    instructor: 'João Silva',
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80',
    rating: 4.9,
    students: 15420,
    duration: '45h',
    modules: 12,
    progress: 65,
    status: 'in_progress'
  },
  {
    id: '2',
    title: 'UX/UI Design: Criando Experiências',
    instructor: 'Maria Santos',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80',
    rating: 4.8,
    students: 8340,
    duration: '28h',
    modules: 8,
    progress: 100,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Node.js Microservices Architecture',
    instructor: 'Pedro Costa',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
    rating: 4.7,
    students: 5230,
    duration: '32h',
    modules: 10,
    progress: 12,
    status: 'in_progress'
  }
];

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');

  const inProgressCourses = ENROLLED_COURSES.filter(c => c.status === 'in_progress');
  const completedCourses = ENROLLED_COURSES.filter(c => c.status === 'completed');

  const displayedCourses = activeTab === 'in_progress' ? inProgressCourses : completedCourses;

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meus Cursos</h1>
        <p className="text-muted mb-8">Acompanhe seu progresso e continue de onde parou.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <PlayCircle size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{inProgressCourses.length}</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Em Andamento</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{completedCourses.length}</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Concluídos</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">73h</p>
              <p className="text-sm font-medium text-muted uppercase tracking-wider">Horas Estudadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-6 py-4 text-sm font-bold transition-colors relative ${
            activeTab === 'in_progress' ? 'text-accent' : 'text-muted hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            Em Andamento ({inProgressCourses.length})
          </div>
          {activeTab === 'in_progress' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-4 text-sm font-bold transition-colors relative ${
            activeTab === 'completed' ? 'text-accent' : 'text-muted hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            Concluídos ({completedCourses.length})
          </div>
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
          )}
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCourses.length > 0 ? (
          displayedCourses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              thumbnail={course.thumbnail}
              rating={course.rating}
              students={course.students}
              duration={course.duration}
              modules={course.modules}
              progress={course.progress}
              className="w-full shrink-0"
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-border/30 border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted mb-4">
              {activeTab === 'in_progress' ? <BookOpen size={32} /> : <Trophy size={32} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'in_progress' ? 'Nenhum curso em andamento' : 'Nenhum curso concluído'}
            </h3>
            <p className="text-muted max-w-md">
              {activeTab === 'in_progress' 
                ? 'Você não possui nenhum curso em andamento no momento. Visite o catálogo para começar a aprender!' 
                : 'Quando você finalizar seus cursos, eles aparecerão aqui com seus respectivos certificados.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
