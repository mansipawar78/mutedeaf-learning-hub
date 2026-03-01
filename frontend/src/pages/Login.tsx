import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoginError, identity, isLoggingIn } = useInternetIdentity();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-card p-8 space-y-8">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-4 text-center">
            <img
              src="/assets/generated/silentlearn-logo.dim_256x256.png"
              alt="SilentLearn Logo"
              className="w-20 h-20 rounded-2xl object-cover shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
                Silent<span className="text-primary">Learn</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your ISL learning companion
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Login Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to continue your ISL learning journey
              </p>
            </div>

            {/* Error state */}
            {isLoginError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-destructive text-sm text-center">
                Login failed. Please try again.
              </div>
            )}

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="w-full text-base font-semibold rounded-xl h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            {/* Security note */}
            <div className="flex items-start gap-2 bg-secondary/50 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Internet Identity is a secure, privacy-preserving authentication system built on the Internet Computer. No passwords required.
              </p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
