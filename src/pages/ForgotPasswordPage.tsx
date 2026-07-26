import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Mail, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';

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

export function ForgotPasswordPage() {
  const { navigate, toast } = useStore();
  const { resetPassword, configured, isMock } = useAuth();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast('Reset link sent — check your inbox');
    } catch (e: any) {
      setErr(e.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button onClick={() => navigate({ name: 'signin' })} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to sign in
      </button>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"><Mail size={22} /></div>
          <h1 className="mt-4 font-display text-2xl font-bold">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink-500">We sent a password reset link to <strong className="text-ink-900 dark:text-white">{email}</strong>.</p>
          <button onClick={() => navigate({ name: 'signin' })} className="btn-dark mt-6">Back to sign in</button>
        </div>
      ) : (
        <>
          <div className="eyebrow">Reset password</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Forgot Password</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Enter your email and we'll send you a link to reset your password.</p>
          {isMock && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 dark:bg-gold-950/20 border border-gold-200/40 p-3 text-xs text-gold-700 dark:text-gold-300">
              <Shield size={14} className="shrink-0 mt-0.5" />
              <span><strong>Demo Mode Active:</strong> Password reset requests are simulated locally in the browser.</span>
            </div>
          )}
          {!configured && <div className="mt-4"><Error message="Firebase is not configured. Add your credentials to .env to enable authentication." /></div>}
          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="relative block">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-lux pl-10" />
            </label>
            <Error message={err} />
            <button type="submit" disabled={loading || !configured} className="btn-dark w-full disabled:opacity-60">
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

export default ForgotPasswordPage;
