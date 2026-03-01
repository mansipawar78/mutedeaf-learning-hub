import { useNavigate } from '@tanstack/react-router';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import type { LessonProgress } from '../backend';

interface LessonCardProps {
  lessonId: string;
  category: string;
  description: string;
  icon: string;
  totalExercises: number;
  progress?: LessonProgress | null;
}

export function LessonCard({
  lessonId,
  category,
  description,
  icon,
  totalExercises,
  progress,
}: LessonCardProps) {
  const navigate = useNavigate();

  const score = progress ? Number(progress.score) : 0;
  const progressPercent = totalExercises > 0 ? Math.min(100, Math.round((score / totalExercises) * 100)) : 0;
  const isCompleted = progress?.completed ?? false;

  return (
    <button
      onClick={() => navigate({ to: '/lesson/$lessonId', params: { lessonId } })}
      className="group w-full text-left bg-card border-2 border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Start ${category} lesson`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl leading-none" role="img" aria-label={category}>
          {icon}
        </div>
        {isCompleted && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-success text-success-foreground">
            ✓ Done
          </span>
        )}
      </div>

      <h3 className="font-heading text-xl font-700 text-foreground mb-1 group-hover:text-primary transition-colors">
        {category}
      </h3>
      <p className="text-base text-muted-foreground mb-4 leading-snug">{description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-semibold text-muted-foreground">
          <span>{score} / {totalExercises} exercises</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2.5" />
      </div>

      <div className="mt-4 flex items-center gap-1 text-primary font-semibold text-base group-hover:gap-2 transition-all">
        Start Learning
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}
