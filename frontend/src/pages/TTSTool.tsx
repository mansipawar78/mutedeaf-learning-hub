import { useState, useEffect } from 'react';
import { Volume2, Square, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTTS } from '../hooks/useTTS';

export function TTSTool() {
  const [text, setText] = useState('');
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState(1);
  const { speak, stop, isSpeaking, voices, isSupported } = useTTS();

  const selectedVoice = voices[selectedVoiceIndex] ?? null;

  const handleSpeak = () => {
    if (text.trim()) {
      speak(text, selectedVoice, rate);
    }
  };

  const sampleTexts = [
    'Hello! Welcome to SilentLearn.',
    'I am learning to communicate better every day.',
    'Thank you for helping me practice.',
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <img src="/assets/generated/speaker-icon.dim_128x128.png" alt="" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-800 text-foreground">Text to Speech</h1>
              <p className="text-lg text-muted-foreground">Type any text and hear it spoken aloud</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-3xl">
        {!isSupported && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-base">
              Text-to-speech is not supported in your browser. Please use a modern browser like Chrome, Edge, or Firefox.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-3xl border-2 border-border shadow-card p-6 md:p-8 space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="tts-text" className="text-lg font-700 text-foreground">
              Enter your text
            </Label>
            <Textarea
              id="tts-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here to hear it spoken..."
              className="min-h-[160px] text-lg resize-none rounded-xl border-2 focus:border-primary"
              disabled={!isSupported}
            />
            <p className="text-sm text-muted-foreground">{text.length} characters</p>
          </div>

          {/* Sample Texts */}
          <div className="space-y-2">
            <Label className="text-base font-600 text-muted-foreground">Quick samples:</Label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample) => (
                <button
                  key={sample}
                  onClick={() => setText(sample)}
                  className="text-sm px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sample.slice(0, 30)}…
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          {voices.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="voice-select" className="text-lg font-700 text-foreground">
                Select Voice
              </Label>
              <Select
                value={String(selectedVoiceIndex)}
                onValueChange={(val) => setSelectedVoiceIndex(Number(val))}
                disabled={!isSupported}
              >
                <SelectTrigger id="voice-select" className="text-base h-12 rounded-xl border-2">
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice, i) => (
                    <SelectItem key={`${voice.name}-${i}`} value={String(i)} className="text-base">
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Speech Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-700 text-foreground">Speech Rate</Label>
              <span className="text-base font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {rate.toFixed(1)}x
              </span>
            </div>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[rate]}
              onValueChange={([val]) => setRate(val)}
              disabled={!isSupported}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground font-semibold">
              <span>0.5x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Fast)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              onClick={handleSpeak}
              disabled={!isSupported || !text.trim() || isSpeaking}
              size="lg"
              className="flex-1 text-lg font-700 h-14 rounded-xl gap-2"
            >
              <Volume2 className="w-5 h-5" />
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </Button>
            <Button
              onClick={stop}
              disabled={!isSpeaking}
              variant="outline"
              size="lg"
              className="h-14 px-6 rounded-xl border-2 text-lg font-700 gap-2"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
          </div>

          {isSpeaking && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full animate-bounce"
                    style={{ height: `${16 + i * 6}px`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-base font-semibold text-primary">Speaking your text...</span>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-accent/10 rounded-2xl p-6 border border-accent/20">
          <h3 className="font-heading text-lg font-700 text-foreground mb-3">💡 Tips for best results</h3>
          <ul className="space-y-2 text-base text-muted-foreground">
            <li>• Use punctuation (commas, periods) for natural pauses</li>
            <li>• Slow down the rate to 0.7x for clearer pronunciation</li>
            <li>• Try different voices to find the most comfortable one</li>
            <li>• Short sentences are easier to follow than long paragraphs</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
