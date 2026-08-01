import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';
import { isAdminEmail } from '../lib/admin/useAdminAuth';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-lux py-16">
      <div className="mx-auto max-w-md rounded-2xl glass p-8 shadow-soft animate-fade-up">
        {children}
      </div>
    </div>
  );
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-3 py-2.5 text-sm text-red-700 dark:text-red-300">
      <AlertCircle size={15} /> {message}
    </div>
  );
}

function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-ink-700 px-5 py-3 text-sm font-semibold transition-all hover:bg-ink-50 dark:hover:bg-ink-600 disabled:opacity-60"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function SignInPage() {
  const { navigate, toast } = useStore();
  const { signIn, signInWithGoogle, configured, isMock } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await signIn(email, password);
      toast('Welcome back');
      if (isAdminEmail(email)) {
        navigate({ name: 'admin', section: 'dashboard' });
      } else {
        navigate({ name: 'profile' });
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithGoogle();
      toast('Welcome back');
      const curr = localStorage.getItem('crazyfeb_current_user');
      const googleEmail = curr ? JSON.parse(curr).email : null;
      if (isAdminEmail(googleEmail)) {
        navigate({ name: 'admin', section: 'dashboard' });
      } else {
        navigate({ name: 'profile' });
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button onClick={() => navigate({ name: 'home' })} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to home
      </button>
      <div className="eyebrow">Welcome back</div>
      <h1 className="mt-2 font-display text-3xl font-bold">Sign In</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Access your orders, wishlist, and saved details.</p>
      {isMock && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 dark:bg-gold-950/20 border border-gold-200/40 p-3 text-xs text-gold-700 dark:text-gold-300">
          <Shield size={14} className="shrink-0 mt-0.5" />
          <span><strong>Demo Mode Active:</strong> Use email <strong className="underline">admin@crazyfeb.com</strong> and password <strong>password</strong> to access the Admin panel.</span>
        </div>
      )}
      {!configured && <div className="mt-4"><Error message="Firebase is not configured. Add your credentials to .env to enable authentication." /></div>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="relative block">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-lux pl-10" />
        </label>
        <label className="relative block">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-lux pl-10 pr-10" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </label>
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate({ name: 'forgot' })} className="text-xs font-medium text-gold-600 hover:underline">Forgot password?</button>
        </div>
        <Error message={err} />
        <button type="submit" disabled={loading || !configured} className="btn-dark w-full disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" /> or <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>
      <GoogleButton onClick={google} disabled={loading || !configured} />
      <p className="mt-6 text-center text-sm text-ink-500">
        New to CrazyFeb?{' '}
        <button onClick={() => navigate({ name: 'signup' })} className="font-semibold text-ink-900 dark:text-white hover:underline">Create an account</button>
      </p>
    </AuthShell>
  );
}

export default SignInPage;
