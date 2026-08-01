import React from 'react';
import { HomepageBuilderLock } from '../../../types';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';

interface BuilderLockBannerProps {
  lock?: HomepageBuilderLock;
  currentAdminEmail?: string;
  onAcquireLock: () => void;
}

export const BuilderLockBanner: React.FC<BuilderLockBannerProps> = ({
  lock,
  currentAdminEmail,
  onAcquireLock,
}) => {
  if (!lock) return null;

  const now = new Date().getTime();
  const expiresAt = new Date(lock.expiresAt).getTime();
  const isExpired = now > expiresAt;

  if (isExpired) return null;

  const isLockedByMe = lock.lockedBy === currentAdminEmail;

  if (isLockedByMe) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-300 mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>
            You have active editing lock on Homepage Builder. Auto-expires in 15 minutes.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-200 mb-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-xs text-amber-100">
            Concurrent Editing Lock Active
          </h4>
          <p className="text-xs text-amber-300/80 mt-0.5">
            This builder is currently being edited by{' '}
            <strong className="text-amber-100">{lock.lockedByName || lock.lockedBy}</strong>.
            Changes saved by other admins will update live.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAcquireLock}
        className="px-3 py-1.5 bg-amber-500 text-black font-semibold rounded-lg text-xs hover:bg-amber-400 transition flex items-center gap-1.5 shrink-0"
      >
        <Unlock className="w-3.5 h-3.5" /> Request Editing Session
      </button>
    </div>
  );
};
