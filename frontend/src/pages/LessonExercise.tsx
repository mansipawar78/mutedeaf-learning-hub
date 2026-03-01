import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { lessons } from '../data/lessons';
import { useTTS } from '../hooks/useTTS';
import { useSTT } from '../hooks/useSTT';
import { useSessionKey, useLessonProgress, useStartLesson, useUpdateScore, useCompleteLesson } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Volume2,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Camera,
} from 'lucide-react';

export default function LessonExercise() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' });
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const sessionKey = useSessionKey();
  const { data: _progress } = useLessonProgress(lessonId);
  const startLesson = useStartLesson();
  const updateScore = useUpdateScore();
  const completeLesson = useCompleteLesson();

  const { speak, stop, isSpeaking } = useTTS();
  const {
    startRecognition,
    stopRecognition,
    clearTranscript,
    isListening,
    finalTranscript,
    error: sttError,
    isSupported: sttSupported,
  } = useSTT();

  const hasStarted = useRef(false);

  useEffect(() => {
    if (sessionKey && lessonId && !hasStarted.current) {
      hasStarted.current = true;
      startLesson.mutate(lessonId);
    }
  }, [sessionKey, lessonId]);

  useEffect(() => {
    if (finalTranscript && lesson) {
      const exercise = lesson.exercises[currentIndex];
      const spoken = finalTranscript.trim().toLowerCase();
      const target = exercise.word.toLowerCase();
      const isCorrect = spoken.includes(target) || target.includes(spoken);
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setAttempts((a) => a + 1);
      if (isCorrect) setCorrectCount((c) => c + 1);
      stopRecognition();
    }
  }, [finalTranscript]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Lesson not found.</p>
          <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isSignLanguageLesson = lessonId === 'sign-language-asl';
  const exercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;
  const progressPercent = ((currentIndex + (feedback === 'correct' ? 1 : 0)) / totalExercises) * 100;

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(exercise.word);
    }
  };

  const handleListen = () => {
    if (isListening) {
      stopRecognition();
    } else {
      clearTranscript();
      setFeedback(null);
      startRecognition();
    }
  };

  const handlePracticeWithCamera = () => {
    navigate({ to: '/sign-camera', search: { target: exercise.word } });
  };

  const handleNext = async () => {
    setFeedback(null);
    clearTranscript();
    stop();
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const score = Math.round((correctCount / Math.max(attempts, 1)) * 100);
      await updateScore.mutateAsync({ lessonId, score });
      await completeLesson.mutateAsync(lessonId);
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFeedback(null);
      clearTranscript();
      stop();
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    clearTranscript();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFeedback(null);
    setCompleted(false);
    setCorrectCount(0);
    setAttempts(0);
    clearTranscript();
    stop();
  };

  if (completed) {
    const score = Math.round((correctCount / Math.max(attempts, 1)) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Lesson Complete!</h1>
          <p className="text-muted-foreground">
            You scored <span className="font-bold text-primary">{score}%</span> on {lesson.title}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-heading text-foreground">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">
              Exercise {currentIndex + 1} of {totalExercises}
            </p>
          </div>
          <Badge variant="outline">{Math.round(progressPercent)}%</Badge>
        </div>

        {/* Progress */}
        <Progress value={progressPercent} className="h-2" />

        {/* Exercise Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-8 space-y-6">
          {isSignLanguageLesson ? (
            /* Sign Language specific layout */
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-500">
                <Camera className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">ASL Sign</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Sign illustration */}
                {exercise.imageUrl && (
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-muted flex items-center justify-center">
                      <img
                        src={exercise.imageUrl}
                        alt={`ASL sign for letter ${exercise.word}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="text-7xl font-bold font-heading text-foreground leading-none">
                    {exercise.word}
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">{exercise.example}</p>
                </div>
              </div>

              {/* Practice with Camera button */}
              <div className="pt-2">
                <Button
                  onClick={handlePracticeWithCamera}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Practice with Camera
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Opens the Sign Camera in guided practice mode for letter "{exercise.word}"
                </p>
              </div>
            </div>
          ) : (
            /* Standard lesson layout */
            <div className="space-y-4">
              <div className="text-center">
                {exercise.emoji && <div className="text-6xl mb-3">{exercise.emoji}</div>}
                <h2 className="text-4xl font-bold font-heading text-foreground">{exercise.word}</h2>
                <p className="text-muted-foreground mt-2">{exercise.example}</p>
              </div>

              {/* TTS / STT controls */}
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSpeak}
                  className={isSpeaking ? 'border-primary text-primary' : ''}
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  {isSpeaking ? 'Stop' : 'Listen'}
                </Button>

                {sttSupported && (
                  <Button
                    size="lg"
                    onClick={handleListen}
                    variant={isListening ? 'destructive' : 'default'}
                    disabled={isSpeaking}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Say it!
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* STT Error */}
              {sttError && (
                <>
                  {sttError === 'not-allowed' ? (
                    <Alert className="border-amber-400 bg-amber-50 dark:bg-amber-950/30">
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <p className="font-semibold mb-1">Microphone access denied</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Click the camera/lock icon in your browser's address bar</li>
                          <li>Set Microphone to "Allow"</li>
                          <li>Refresh the page and try again</li>
                        </ol>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Speech recognition encountered an error. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {/* Feedback */}
              {feedback && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl ${
                    feedback === 'correct'
                      ? 'bg-success/10 text-success border border-success/30'
                      : 'bg-destructive/10 text-destructive border border-destructive/30'
                  }`}
                >
                  {feedback === 'correct' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="font-medium">
                    {feedback === 'correct' ? 'Great job! That was correct!' : 'Not quite — try again!'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {!isSignLanguageLesson && feedback === 'incorrect' && (
              <Button variant="outline" onClick={handleRetry}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isSignLanguageLesson && !feedback}
            >
              {currentIndex === totalExercises - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* For sign language, allow advancing without camera */}
        {isSignLanguageLesson && (
          <p className="text-xs text-center text-muted-foreground">
            Practice with the camera above, then click Next to continue.
          </p>
        )}
      </div>
    </div>
  );
}
