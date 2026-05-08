import { PlayCircle, TrendingUp, Code, Terminal, Shield, Megaphone, Search, Compass } from 'lucide-react';
import { CourseCard } from '../components/ui/CourseCard';
import { useNavigate } from 'react-router-dom';

// Mock Data
const MOCK_COURSES = {
  trending: [
    { id: '1', title: 'Bootcamp React Native do Zero ao Profissional', instructor: 'Thiago Silva', thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop', rating: 4.9, students: 12500, duration: '45h', modules: 12, price: 199.90 },
    { id: '2', title: 'Arquitetura de Microsserviços com Node.js', instructor: 'Amanda Costa', thumbnail: 'https://images.unsplash.com/photo-1627398246654-4f856353d9e0?w=600&h=400&fit=crop', rating: 4.8, students: 8300, duration: '32h', modules: 8, price: 149.90 },
    { id: '3', title: 'UX/UI Design: Criando Experiências', instructor: 'Lucas Ferreira', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', rating: 4.9, students: 15200, duration: '28h', modules: 6, price: 0 },
    { id: '4', title: 'Python para Análise de Dados', instructor: 'Juliana Paiva', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', rating: 4.7, students: 9100, duration: '40h', modules: 10, price: 89.90 },
    { id: '5', title: 'Fundamentos de DevOps e CI/CD', instructor: 'Roberto Almeida', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98a5233c591?w=600&h=400&fit=crop', rating: 4.8, students: 6400, duration: '25h', modules: 7, price: 129.90 },
  ],
  frontend: [
    { id: '6', title: 'Masterizando React e Next.js', instructor: 'Thiago Silva', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', rating: 4.9, students: 21000, duration: '50h', modules: 15, price: 249.90 },
    { id: '7', title: 'CSS Avançado e Animações Web', instructor: 'Carla Dias', thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop', rating: 4.8, students: 5400, duration: '18h', modules: 5, price: 59.90 },
    { id: '8', title: 'Vue.js 3 na Prática', instructor: 'Fernando Souza', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', rating: 4.7, students: 4200, duration: '22h', modules: 6, price: 0 },
  ],
  backend: [
    { id: '9', title: 'Formação Especialista Node.js', instructor: 'Amanda Costa', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', rating: 4.9, students: 18000, duration: '60h', modules: 18, price: 299.90 },
    { id: '10', title: 'Java Spring Boot Profissional', instructor: 'Marcos Lima', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', rating: 4.8, students: 11200, duration: '55h', modules: 14, price: 199.90 },
    { id: '11', title: 'Go (Golang) para Alta Performance', instructor: 'Roberto Almeida', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=600&h=400&fit=crop', rating: 4.9, students: 3800, duration: '30h', modules: 8, price: 159.90 },
  ],
  cyber: [
    { id: '12', title: 'Introdução ao Ethical Hacking', instructor: 'Rafael Gomes', thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop', rating: 4.8, students: 8900, duration: '35h', modules: 10, price: 179.90 },
    { id: '13', title: 'Segurança em Aplicações Web', instructor: 'Diana Martins', thumbnail: 'https://images.unsplash.com/photo-1614064641913-6b1e62c16194?w=600&h=400&fit=crop', rating: 4.9, students: 4500, duration: '28h', modules: 7, price: 149.90 },
  ],
  marketing: [
    { id: '14', title: 'Marketing Digital Completo', instructor: 'Sofia Ribeiro', thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop', rating: 4.7, students: 14500, duration: '42h', modules: 12, price: 129.90 },
    { id: '15', title: 'Tráfego Pago: Google & Meta Ads', instructor: 'Bruno Carvalho', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', rating: 4.8, students: 9800, duration: '26h', modules: 8, price: 99.90 },
  ]
};

const Section = ({ title, icon: Icon, courses }: { title: string, icon: any, courses: any[] }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Icon size={24} />
      </div>
      <h2 className="text-2xl font-bold text-text">{title}</h2>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
      {courses.map(course => (
        <div key={course.id} className="snap-start shrink-0">
          <CourseCard {...course} />
        </div>
      ))}
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta! 👋</h1>
        <p className="text-muted">Continue de onde parou ou descubra novos conhecimentos.</p>
      </header>

      {/* Continue Watching Mock */}
      <div className="bg-card border border-border rounded-xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:border-accent/50 transition-colors cursor-pointer group">
        <div className="relative w-full md:w-72 h-40 rounded-lg overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop" alt="Curso Atual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <PlayCircle className="text-white/80 w-12 h-12 group-hover:text-accent transition-colors" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-bg">
            <div className="h-full bg-accent w-[65%]"></div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-accent text-xs font-bold uppercase tracking-wider mb-2">Continue Assistindo</p>
          <h3 className="text-xl font-bold text-text mb-2">Masterizando React e Next.js</h3>
          <p className="text-sm text-muted mb-4">Módulo 4: Gerenciamento de Estado Avançado</p>
          <div className="flex items-center gap-4 text-xs text-muted">
             <span>Progresso: 65%</span>
             <span>Restam 18 aulas</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <Section title="Em Alta na Plataforma" icon={TrendingUp} courses={MOCK_COURSES.trending} />
      <Section title="Desenvolvimento Front-end" icon={Code} courses={MOCK_COURSES.frontend} />
      <Section title="Desenvolvimento Back-end" icon={Terminal} courses={MOCK_COURSES.backend} />
      <Section title="Cyber Segurança" icon={Shield} courses={MOCK_COURSES.cyber} />
      <Section title="Marketing Digital" icon={Megaphone} courses={MOCK_COURSES.marketing} />

      {/* Explore More */}
      <div className="mt-16 bg-[#121214] border border-[#27272a] rounded-2xl p-10 text-center relative overflow-hidden flex flex-col items-center shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6 relative z-10">
          <Compass size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Explore Mais Cursos</h2>
        <p className="text-muted mb-8 max-w-lg relative z-10">
          Ainda não encontrou o que procura? Temos centenas de cursos disponíveis no nosso catálogo completo para impulsionar a sua carreira.
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); navigate(`/catalog?q=${q}`); }} className="relative w-full max-w-lg z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            name="q"
            placeholder="O que você quer aprender hoje? (Ex: React, Python, UI/UX)" 
            className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-12 pr-32 py-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted shadow-inner"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accentHover transition-colors shadow-md">
            Buscar
          </button>
        </form>
      </div>

    </div>
  );
};
