import { useState } from 'react';
import { Mic, MicOff, Copy, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSTT } from '../hooks/useSTT';

export function STTTool() {
  const {
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    isSupported,
    startRecognition,
    stopRecognition,
    clearTranscript,
  } = useSTT();

  const [copied, setCopied] = useState(false);

  const isMicPermissionDenied = !!(error?.includes('not-allowed') || error?.includes('permission'));

  const handleCopy = async () => {
    if (!finalTranscript.trim()) return;
    await navigator.clipboard.writeText(finalTranscript.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = () => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-accent/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <img src="/assets/generated/mic-icon.dim_128x128.png" alt="" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-800 text-foreground">Speech to Text</h1>
              <p className="text-lg text-muted-foreground">Speak and see your words appear in real time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-3xl">
        {!isSupported && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-base">
              Speech recognition is not supported in your browser. Please use Chrome or Edge for the best experience.
            </AlertDescription>
          </Alert>
        )}

        {/* Microphone permission denied — prominent styled warning banner */}
        {isMicPermissionDenied && (
          <Alert className="mb-6 border-2 border-amber-500/40 bg-amber-50 dark:bg-amber-950/30">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-base font-700 text-amber-800 dark:text-amber-300">
              Microphone Access Blocked
            </AlertTitle>
            <AlertDescription className="text-amber-900/80 dark:text-amber-200/80 mt-1">
              <p className="mb-2 text-sm">Your browser is blocking microphone access. Follow these steps to fix it:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Click the <strong>microphone or lock icon</strong> in your browser's address bar (top of the page).</li>
                <li>Set <strong>Microphone</strong> permission to <strong>Allow</strong>.</li>
                <li><strong>Refresh the page</strong> and try again.</li>
              </ol>
              <p className="mt-2 text-xs text-amber-700/70 dark:text-amber-300/60">
                If you're in Incognito/Private mode, microphone access may be blocked by default.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Generic errors (not permission-related) */}
        {error && !isMicPermissionDenied && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-base">
              An error occurred with speech recognition. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-3xl border-2 border-border shadow-card p-6 md:p-8 space-y-6">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-4 py-4">
            <button
              onClick={handleToggle}
              disabled={!isSupported}
              aria-label={isListening ? 'Stop recording' : 'Start recording'}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-destructive text-destructive-foreground animate-pulse-amber shadow-lg'
                  : 'bg-primary text-primary-foreground hover:scale-105 shadow-card hover:shadow-card-hover'
              }`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
            <p className="text-lg font-700 text-foreground">
              {isListening ? (
                <span className="text-destructive flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive animate-pulse inline-block" />
                  Listening... Click to stop
                </span>
              ) : (
                'Click the microphone to start'
              )}
            </p>
          </div>

          {/* Live Transcript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-700 text-foreground">Live Transcript</h2>
              {isListening && (
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full animate-pulse">
                  Recording...
                </span>
              )}
            </div>
            <div
              className={`min-h-[120px] p-4 rounded-xl border-2 text-lg leading-relaxed ${
                isListening ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30'
              }`}
              aria-live="polite"
              aria-label="Live transcript"
            >
              {finalTranscript && (
                <span className="text-foreground font-semibold">{finalTranscript}</span>
              )}
              {interimTranscript && (
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              )}
              {!finalTranscript && !interimTranscript && (
                <span className="text-muted-foreground">
                  {isListening ? 'Start speaking...' : 'Your transcript will appear here'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleCopy}
              disabled={!finalTranscript.trim()}
              variant="outline"
              size="default"
              className="gap-2 font-700 border-2 rounded-xl"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Text
                </>
              )}
            </Button>
            <Button
              onClick={clearTranscript}
              disabled={!finalTranscript && !interimTranscript}
              variant="outline"
              size="default"
              className="gap-2 font-700 border-2 rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/40"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
            <h3 className="text-sm font-700 text-foreground">💡 Tips for best results</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Use a quiet environment for better accuracy</li>
              <li>• Allow microphone access when prompted by your browser</li>
              <li>• Works best in Chrome or Edge browsers</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
