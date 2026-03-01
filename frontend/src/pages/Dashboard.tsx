import { Volume2, Mic, Star, Camera } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { LessonCard } from '../components/LessonCard';
import { lessons } from '../data/lessons';
import { useAllProgress } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { data: allProgress, isLoading } = useAllProgress();

  const getProgressForLesson = (lessonId: string) => {
    return allProgress?.find((p) => p.lessonId === lessonId) ?? null;
  };

  const totalCompleted = allProgress?.filter((p) => p.completed).length ?? 0;
  const totalScore = allProgress?.reduce((sum, p) => sum + Number(p.score), 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Star className="w-4 h-4" />
                Accessible Learning for Everyone
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-800 text-foreground mb-4 leading-tight">
                Welcome to{' '}
                <span className="text-primary">SilentLearn</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                Learn to communicate with confidence using interactive lessons, text-to-speech, voice recognition, and real-time sign language detection.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/tts">
                  <Button size="lg" variant="outline" className="gap-2 text-base font-semibold border-2">
                    <Volume2 className="w-5 h-5" />
                    Text to Speech
                  </Button>
                </Link>
                <Link to="/stt">
                  <Button size="lg" variant="outline" className="gap-2 text-base font-semibold border-2">
                    <Mic className="w-5 h-5" />
                    Speech to Text
                  </Button>
                </Link>
                <Link to="/sign-camera" search={{ target: undefined }}>
                  <Button size="lg" variant="outline" className="gap-2 text-base font-semibold border-2">
                    <Camera className="w-5 h-5" />
                    Sign Camera
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/assets/generated/hero-illustration.dim_800x400.png"
                alt="Person learning with SilentLearn"
                className="w-full max-w-sm md:max-w-md rounded-2xl shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {allProgress && allProgress.length > 0 && (
        <section className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-base font-semibold">
                <span className="text-muted-foreground">Lessons started:</span>
                <span className="text-foreground">{allProgress.length}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-semibold">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground">Completed:</span>
                <span className="text-foreground">{totalCompleted}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-semibold">
                <span className="text-muted-foreground">Total score:</span>
                <span className="text-foreground">{totalScore} pts</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lessons Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-700 text-foreground mb-2">Your Lessons</h2>
          <p className="text-lg text-muted-foreground">Choose a lesson to start practicing</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lessonId={lesson.id}
                category={lesson.title}
                description={lesson.description}
                icon={lesson.icon}
                totalExercises={lesson.exercises.length}
                progress={getProgressForLesson(lesson.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Tools Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-border">
          <h2 className="font-heading text-2xl font-700 text-foreground mb-2">Quick Tools</h2>
          <p className="text-base text-muted-foreground mb-6">Use these tools anytime to practice communication</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/tts" className="group block">
              <div className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-xs hover:shadow-card flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <img src="/assets/generated/speaker-icon.dim_128x128.png" alt="" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-700 text-foreground group-hover:text-primary transition-colors">Text to Speech</h3>
                  <p className="text-base text-muted-foreground">Type any text and hear it spoken aloud</p>
                </div>
              </div>
            </Link>
            <Link to="/stt" className="group block">
              <div className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-xs hover:shadow-card flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/assets/generated/mic-icon.dim_128x128.png" alt="" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-700 text-foreground group-hover:text-primary transition-colors">Speech to Text</h3>
                  <p className="text-base text-muted-foreground">Speak and see your words in real time</p>
                </div>
              </div>
            </Link>
            <Link to="/sign-camera" search={{ target: undefined }} className="group block">
              <div className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-xs hover:shadow-card flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <img src="/assets/generated/sign-camera-icon.dim_128x128.png" alt="" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-700 text-foreground group-hover:text-primary transition-colors">Sign Camera</h3>
                  <p className="text-base text-muted-foreground">Detect ASL signs in real time</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
