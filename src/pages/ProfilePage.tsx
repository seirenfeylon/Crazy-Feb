import { useState } from 'react';
import { ArrowLeft, LogOut, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';
import { useAdminAuth } from '../lib/admin/useAdminAuth';
import { SectionHeading } from '../components/ui';

export function ProfilePage() {
  const { navigate, toast, wishlist } = useStore();
  const { user, logout, updateDisplayName, isMock } = useAuth();
  const { isAdmin, checkingAdmin } = useAdminAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateDisplayName(name);
      setEditing(false);
      toast('Profile updated');
    } catch {
      toast('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast('Signed out');
    navigate({ name: 'home' });
  };

  return (
    <div className="container-lux py-14">
      <SectionHeading eyebrow="Your account" title="Profile" subtitle="Manage your details, orders, and saved pieces." />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-900 text-white dark:bg-white dark:text-ink-900 font-display text-2xl font-bold">
              {(user?.displayName?.[0] || user?.email?.[0] || 'P').toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.displayName || 'CrazyFeb Member'}</h2>
              <p className="text-sm text-ink-500">{user?.email}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                <Shield size={11} /> Verified member
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-black/5 dark:border-white/10 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Display name</h3>
            {editing ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-lux flex-1" />
                <div className="flex gap-2">
                  <button onClick={save} disabled={saving} className="btn-dark">{saving ? 'Saving…' : 'Save'}</button>
                  <button onClick={() => { setEditing(false); setName(user?.displayName || ''); }} className="btn-ghost">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium">{user?.displayName || '—'}</span>
                <button onClick={() => setEditing(true)} className="text-xs font-semibold text-gold-600 hover:underline">Edit</button>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-black/5 dark:border-white/10 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Email</h3>
            <p className="mt-3 text-sm font-medium">{user?.email}</p>
          </div>

          <div className="mt-6 border-t border-black/5 dark:border-white/10 pt-6">
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-900/40">
              <LogOut size={15} /> Sign out
            </button>
          </div>

          {isMock && (
            <p className="mt-6 text-xs text-ink-400">Note: Firebase is not configured. Sign-in is running in demo mode.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h3 className="font-display text-lg font-semibold">At a glance</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: wishlist.length, v: 'Wishlist' },
                { k: 0, v: 'Orders' },
                { k: '—', v: 'Points' },
              ].map((s) => (
                <div key={s.v} className="rounded-xl bg-ink-50 dark:bg-ink-700/50 p-3 text-center">
                  <div className="font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h3 className="font-display text-lg font-semibold">Quick links</h3>
            <div className="mt-3 flex flex-col">
              {[
                { label: 'Wishlist', route: { name: 'wishlist' } as const },
                { label: 'Track an order', route: { name: 'track' } as const },
                { label: 'Continue shopping', route: { name: 'shop' } as const },
                ...(!checkingAdmin && isAdmin ? [{ label: 'Admin Dashboard', route: { name: 'admin' as const, section: 'dashboard' as const } }] : []),
              ].map((l) => (
                <button key={l.label} onClick={() => navigate(l.route)} className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                  {l.label} <ArrowLeft size={14} className="rotate-180 text-ink-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
