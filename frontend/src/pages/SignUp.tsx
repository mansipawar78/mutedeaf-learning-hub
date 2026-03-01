import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, ShieldCheck, Fingerprint, Globe } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { login, isLoginError, identity, isLoggingIn } = useInternetIdentity();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleSignUp = async () => {
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
                Start your ISL learning journey today
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Sign Up Section */}
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Create your account</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Join SilentLearn and master Indian Sign Language
              </p>
            </div>

            {/* What is Internet Identity */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                What is Internet Identity?
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Secure & private</span> — No email, password, or personal data required
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3">
                  <Fingerprint className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Biometric login</span> — Use Face ID, fingerprint, or a security key
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3">
                  <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Decentralized</span> — Powered by the Internet Computer blockchain
                  </p>
                </div>
              </div>
            </div>

            {/* Error state */}
            {isLoginError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-destructive text-sm text-center">
                Account creation failed. Please try again.
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              onClick={handleSignUp}
              disabled={isLoggingIn}
              size="lg"
              className="w-full text-base font-semibold rounded-xl h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account with Internet Identity
                </>
              )}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
