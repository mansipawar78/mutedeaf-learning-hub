import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Volume2,
  Mic,
  Camera,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Sun,
  Eye,
  Ruler,
} from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-heading text-foreground">Help &amp; Guide</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about using SilentLearn effectively.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* App Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-heading text-foreground">
            About SilentLearn
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            SilentLearn is an accessible language learning app designed for everyone — including those who are
            deaf, hard of hearing, or learning sign language. It combines text-to-speech, speech-to-text, and
            real-time sign language recognition to create a comprehensive learning experience.
          </p>
        </section>

        {/* ISL Sign Language Recognizer */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold font-heading text-foreground">
            ISL Sign Language Recognizer
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The ISL Sign Language Recognizer uses your device's camera and TensorFlow.js to detect{' '}
            <strong>ISL (Indian Sign Language)</strong> hand gestures in real time — entirely in your browser,
            with no data sent to any server. It supports the ISL alphabet letters A through Z using
            heuristic hand landmark analysis.
          </p>

          <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-lg">How to use the Sign Camera for ISL</h3>
            <ol className="space-y-3">
              {[
                'Click "Sign Camera" in the navigation bar, or click "Practice with Camera" from any ISL lesson exercise.',
                'Click "Start Camera" to activate your webcam. Your browser may ask for camera permission — click Allow.',
                'Hold your hand up in front of the camera with good lighting and fingers clearly visible.',
                'The app will detect your ISL hand gesture and display the recognized letter in real time.',
                'In free-form mode, you can enable "Auto-Speak" to hear each recognized ISL sign spoken aloud.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Guided Practice Mode */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Guided ISL Practice Mode
            </h3>
            <p className="text-muted-foreground">
              When you click <strong>"Practice with Camera"</strong> from an ISL lesson exercise, the Sign
              Camera opens in <strong>guided practice mode</strong>. In this mode:
            </p>
            <ul className="space-y-2">
              {[
                'The target ISL letter is displayed prominently above the camera feed.',
                'A reference image of the correct ISL hand shape is shown for comparison.',
                'When your hand sign matches the target ISL letter, a "Correct!" banner appears.',
                "If your sign doesn't match yet, a \"Keep trying…\" prompt guides you to adjust your hand shape.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Camera Tips */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Tips for Best ISL Recognition
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Lighting
                </div>
                <p className="text-sm text-muted-foreground">
                  Use bright, even lighting. Avoid backlighting or shadows falling on your hand — good
                  lighting helps the camera detect hand landmarks accurately.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Eye className="w-4 h-4 text-amber-500" />
                  Hand Position
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your hand centered in the frame with fingers clearly visible. Form ISL hand shapes
                  deliberately and hold them steady for a moment.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Ruler className="w-4 h-4 text-amber-500" />
                  Distance
                </div>
                <p className="text-sm text-muted-foreground">
                  Hold your hand about 30–60 cm (1–2 feet) from the camera. Too close or too far reduces
                  detection accuracy.
                </p>
              </div>
            </div>
          </div>

          {/* ISL vs ASL note */}
          <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">🤟</span>
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">About ISL (Indian Sign Language)</p>
              <p className="text-sm text-muted-foreground">
                ISL is the primary sign language used by the Deaf community in India. It has its own grammar
                and vocabulary distinct from ASL (American Sign Language). This app focuses on ISL alphabet
                recognition to help learners get started with Indian Sign Language. Both ISL and ASL lesson
                categories are available in the Lessons section.
              </p>
            </div>
          </div>
        </section>

        {/* Text-to-Speech */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-primary" />
            Text-to-Speech Tool
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The TTS tool converts any text you type into spoken audio using your browser's built-in speech
            synthesis engine.
          </p>
          <ul className="space-y-2">
            {[
              'Type or paste any text into the input area.',
              'Choose a voice from the dropdown and adjust the speaking rate.',
              'Click "Speak" to hear the text read aloud.',
              'Use sample texts for quick practice.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Speech-to-Text */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Mic className="w-6 h-6 text-accent" />
            Speech-to-Text Tool
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The STT tool listens to your microphone and transcribes your speech into text in real time.
          </p>
          <ul className="space-y-2">
            {[
              'Click the microphone button to start listening.',
              'Speak clearly and at a normal pace.',
              'Your words will appear as you speak.',
              'Click the button again to stop recording.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Lessons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-heading text-foreground">
            Lessons
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Lessons guide you through structured exercises for alphabet, phrases, numbers, vocabulary, ASL
            sign language, and ISL (Indian Sign Language). Each lesson tracks your progress and score.
          </p>
          <ul className="space-y-2">
            {[
              'Click any lesson card on the Dashboard to begin.',
              'For standard lessons, listen to the word and try to say it using the microphone.',
              'For ISL lessons, view the hand shape description and click "Practice with Camera" to practice with real-time ISL recognition.',
              'For ASL lessons, view the hand shape illustration and practice with the camera in ASL mode.',
              'Your progress and score are saved automatically.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold font-heading text-foreground">Ready to start learning ISL?</h2>
          <p className="text-muted-foreground">
            Head back to the Dashboard and pick an ISL lesson or try the Sign Camera for real-time detection.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate({ to: '/' })}>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/sign-camera', search: { target: undefined } })}
            >
              <Camera className="w-4 h-4 mr-2" />
              Open Sign Camera
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
