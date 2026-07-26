import { useState } from 'react';
import { User } from 'lucide-react';
import { useStore } from '../store';

export function AccountPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { toast, navigate, wishlist } = useStore();
  return (
    <div className="container-lux py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-8">
        <div className="mb-6 flex rounded-full bg-ink-100 dark:bg-ink-700 p-1">
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all ${mode === m ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-500'}`}>{m === 'login' ? 'Sign In' : 'Sign Up'}</button>
          ))}
        </div>
        <h1 className="font-display text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-1 text-sm text-ink-500">{mode === 'login' ? 'Access your orders, wishlist, and saved details.' : 'Join CrazyFeb for early access and 20% off.'}</p>
        <form onSubmit={(e) => { e.preventDefault(); toast(mode === 'login' ? 'Signed in' : 'Account created — welcome'); navigate({ name: 'home' }); }} className="mt-6 space-y-3">
          {mode === 'signup' && <input required placeholder="Full name" className="input-lux" />}
          <input required type="email" placeholder="Email" className="input-lux" />
          <input required type="password" placeholder="Password" className="input-lux" />
          {mode === 'login' && <button type="button" className="text-xs text-gold-600 hover:underline">Forgot password?</button>}
          <button type="submit" className="btn-dark w-full">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-500">
          <User size={14} /> {wishlist.length} items in your wishlist
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
