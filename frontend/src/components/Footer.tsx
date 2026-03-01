import { Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'silentlearn');

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-base text-muted-foreground">
        <p className="font-semibold">
          © {year} SilentLearn — Accessible Learning for Everyone
        </p>
        <p className="flex items-center gap-1.5 font-semibold">
          Built with{' '}
          <Heart className="w-4 h-4 text-destructive fill-destructive" aria-label="love" />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-700"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
