import { useEffect, useRef, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useCamera } from '../camera/useCamera';
import { useHandGestureRecognition } from '../hooks/useHandGestureRecognition';
import { useTTS } from '../hooks/useTTS';
import { drawLandmarks } from '../utils/gestureMapping';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  Target,
  Hand,
} from 'lucide-react';

export default function SignCamera() {
  const navigate = useNavigate();

  // Read optional target sign from query params (guided practice mode)
  const search = useSearch({ from: '/sign-camera' });
  const targetSign: string | undefined = (search as { target?: string }).target;

  const { speak, stop, isSpeaking } = useTTS();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const lastSpokenLabel = useRef<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const correctTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: 'user', width: 640, height: 480 });

  const {
    label,
    confidence,
    landmarks,
    status,
    startRecognition,
    stopRecognition,
  } = useHandGestureRecognition();

  // Draw landmarks on canvas overlay
  useEffect(() => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (landmarks && landmarks.length > 0) {
          drawLandmarks(ctx, landmarks);
        }
      }
    }
  }, [landmarks]);

  // Start recognition when camera becomes active
  useEffect(() => {
    if (isActive && videoRef.current) {
      startRecognition(videoRef.current);
    } else if (!isActive) {
      stopRecognition();
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
    };
  }, []);

  // Auto-TTS for free-form mode
  useEffect(() => {
    if (!autoSpeak || !label || targetSign) return;
    if (label !== lastSpokenLabel.current) {
      lastSpokenLabel.current = label;
      stop();
      speak(label);
    }
  }, [label, autoSpeak, targetSign]);

  // Guided practice mode: check if detected sign matches target
  useEffect(() => {
    if (!targetSign || !label) return;
    const detected = label.trim().toUpperCase();
    const target = targetSign.trim().toUpperCase();
    if (detected === target) {
      setShowCorrect(true);
      if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
      correctTimerRef.current = setTimeout(() => setShowCorrect(false), 3000);
    }
  }, [label, targetSign]);

  const handleToggleCamera = async () => {
    if (isActive) {
      stopRecognition();
      stop();
      await stopCamera();
    } else {
      lastSpokenLabel.current = null;
      await startCamera();
    }
  };

  const isGuidedMode = !!targetSign;
  const detectedMatchesTarget =
    isGuidedMode &&
    !!label &&
    label.trim().toUpperCase() === targetSign!.trim().toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Sign Camera
            </h1>
            <p className="text-sm text-muted-foreground">
              {isGuidedMode
                ? `Guided Practice — Sign the ISL letter "${targetSign}"`
                : 'Real-time ISL (Indian Sign Language) recognition'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700 text-xs">
              🤟 ISL
            </Badge>
            {isGuidedMode && (
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                <Target className="w-3 h-3 mr-1" />
                Practice Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Guided Practice Target Banner */}
        {isGuidedMode && (
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-300 dark:border-teal-700 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white font-heading">{targetSign}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-1">
                Target ISL Sign
              </p>
              <p className="text-foreground font-bold text-xl">Letter "{targetSign}"</p>
              <p className="text-muted-foreground text-sm mt-1">
                Show the ISL (Indian Sign Language) hand sign for this letter in front of your camera
              </p>
            </div>
            {/* Reference image */}
            <div className="flex-shrink-0 hidden sm:block">
              <img
                src={`/assets/generated/isl-sign-${targetSign!.toLowerCase()}.dim_256x256.png`}
                alt={`ISL sign for ${targetSign}`}
                className="w-20 h-20 rounded-lg object-cover border-2 border-teal-200 dark:border-teal-700"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Camera Feed */}
        <div className="relative bg-muted rounded-2xl overflow-hidden border border-border shadow-card">
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Not active overlay */}
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/90 gap-4">
                <CameraOff className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground font-medium">Camera is off</p>
                {isSupported === false && (
                  <p className="text-destructive text-sm text-center px-4">
                    Camera is not supported in this browser.
                  </p>
                )}
              </div>
            )}

            {/* Loading overlay */}
            {cameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Correct banner (guided mode) */}
            {showCorrect && isGuidedMode && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-success/90 text-white rounded-2xl px-8 py-5 flex items-center gap-3 shadow-lg">
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-2xl font-bold font-heading">Correct!</span>
                </div>
              </div>
            )}

            {/* Status badge */}
            {isActive && (
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge
                  className={`text-xs ${
                    status === 'detecting'
                      ? 'bg-success/90 text-white'
                      : 'bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {status === 'loading'
                    ? 'Loading model…'
                    : status === 'detecting'
                    ? '● Detecting ISL'
                    : status === 'idle'
                    ? 'Ready'
                    : status}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Camera error */}
        {cameraError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-destructive text-sm">
            <p className="font-semibold mb-1">Camera Error</p>
            <p>{cameraError.message}</p>
          </div>
        )}

        {/* Camera Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleToggleCamera}
            disabled={cameraLoading || isSupported === false}
            variant={isActive ? 'destructive' : 'default'}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            {isActive ? (
              <>
                <CameraOff className="w-5 h-5 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Start Camera
              </>
            )}
          </Button>

          {/* Auto-speak toggle (free-form mode only) */}
          {!isGuidedMode && (
            <Button
              variant={autoSpeak ? 'default' : 'outline'}
              size="lg"
              onClick={() => setAutoSpeak((v) => !v)}
              className="flex-1 sm:flex-none"
            >
              {autoSpeak ? (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Auto-Speak On
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Auto-Speak Off
                </>
              )}
            </Button>
          )}
        </div>

        {/* Detected Sign Panel */}
        <div
          className={`rounded-2xl border p-6 transition-all duration-300 ${
            isGuidedMode
              ? detectedMatchesTarget
                ? 'bg-success/10 border-success/40'
                : label
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                : 'bg-card border-border'
              : 'bg-card border-border'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {isGuidedMode ? 'Detected ISL Sign' : 'ISL Sign Detected'}
            </h2>
            {label && confidence !== null && (
              <Badge variant="outline" className="text-xs">
                {Math.round((confidence ?? 0) * 100)}% confidence
              </Badge>
            )}
          </div>

          {label ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold font-heading text-foreground">{label}</span>
                {isGuidedMode && (
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      detectedMatchesTarget
                        ? 'bg-success/20 text-success'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {detectedMatchesTarget ? '✓ Match!' : `Target: ${targetSign}`}
                  </span>
                )}
              </div>
              {!isGuidedMode && (
                <p className="text-muted-foreground text-sm">
                  ISL letter detected with {Math.round((confidence ?? 0) * 100)}% confidence
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Hand className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-muted-foreground text-sm">
                {isActive
                  ? 'Show your hand in front of the camera to detect ISL signs'
                  : 'Start the camera to begin ISL sign detection'}
              </p>
            </div>
          )}
        </div>

        {/* ISL Tips */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> ISL Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Keep your hand clearly visible and well-lit in the camera frame
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Hold each ISL hand shape steady for 1–2 seconds for best detection
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Use a plain background to improve recognition accuracy
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              ISL (Indian Sign Language) uses one-handed alphabet signs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
