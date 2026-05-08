import { Star, Clock, Users, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  modules: number;
  price?: number;
  progress?: number;
  className?: string;
}

export const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  rating,
  students,
  duration,
  modules,
  price,
  progress,
  className = "w-[300px] shrink-0"
}: CourseCardProps) => {
  return (
    <Link to={`/course/${id}`} className={`block group ${className}`}>
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="text-accent w-12 h-12" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-text mb-1 line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted mb-3">{instructor}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-text font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            {progress !== undefined ? (
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-medium text-muted">Progresso</span>
                  <span className="text-xs font-bold text-accent">{progress}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 border border-border/30 overflow-hidden">
                  <div className="bg-accent h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">{modules} módulos</span>
                {price !== undefined && price > 0 ? (
                  <span className="font-bold text-accent">R$ {price.toFixed(2).replace('.', ',')}</span>
                ) : (
                  <span className="font-bold text-success">Gratuito</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
