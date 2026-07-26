import React from 'react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { ready, user, configured } = useAuth();
  const { navigate } = useStore();
  if (!ready) {
    return (
      <div className="container-lux py-24 text-center text-sm text-ink-500">Loading…</div>
    );
  }
  if (!configured || !user) {
    if (!configured) {
      return (
        <div className="container-lux py-24 text-center">
          <p className="text-sm text-ink-500">Authentication is not configured.</p>
          <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-4">Back home</button>
        </div>
      );
    }
    setTimeout(() => navigate({ name: 'signin' }), 0);
    return (
      <div className="container-lux py-24 text-center text-sm text-ink-500">Redirecting to sign in…</div>
    );
  }
  return <>{children}</>;
}

export default ProtectedRoute;
