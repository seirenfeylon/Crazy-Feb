import React from 'react';
import { HomepageBuilderVersionSnapshot } from '../../../types';
import { History, RotateCcw, X, User, Layers } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions?: HomepageBuilderVersionSnapshot[];
  onRestoreVersion: (snapshot: HomepageBuilderVersionSnapshot) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions = [],
  onRestoreVersion,
}) => {
  if (!isOpen) return null;

  const sortedVersions = [...versions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleRestore = (snapshot: HomepageBuilderVersionSnapshot) => {
    if (confirm(`Are you sure you want to restore the layout snapshot from ${new Date(snapshot.timestamp).toLocaleString()}? A backup of your current state will automatically be saved.`)) {
      onRestoreVersion(snapshot);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-ink-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-ink-50 dark:bg-ink-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gold-500/10 text-gold-500 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-ink-900 dark:text-white">
                Version History Snapshots
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-300">
                Latest 20 snapshots kept automatically with instant rollback safety.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {sortedVersions.length === 0 ? (
            <div className="py-12 text-center text-ink-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No saved snapshots found yet.</p>
              <p className="text-xs mt-1 text-ink-500">Snapshots are automatically captured each time you publish or restore.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedVersions.map((snapshot, index) => {
                const dateStr = new Date(snapshot.timestamp).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });

                const isLatest = index === 0;

                return (
                  <div
                    key={snapshot.id || index}
                    className={`p-4 rounded-xl border transition-all ${
                      isLatest
                        ? 'border-gold-500/50 bg-gold-500/5'
                        : 'border-black/10 dark:border-white/10 bg-white dark:bg-ink-800 hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink-900 dark:text-white">
                            {dateStr}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gold-500 text-black">
                              Current / Latest
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-ink-500 dark:text-ink-300">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-gold-500" />
                            {snapshot.adminName || snapshot.adminEmail || 'Admin'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-gold-500" />
                            {snapshot.sections?.length || 0} Sections
                          </span>
                        </div>

                        {snapshot.note && (
                          <p className="text-xs text-ink-600 dark:text-ink-200 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-md mt-1 italic">
                            "{snapshot.note}"
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestore(snapshot)}
                        className="px-3.5 py-2 bg-ink-900 dark:bg-white text-white dark:text-black font-semibold text-xs rounded-xl hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <RotateCcw className="w-4 h-4" /> Restore Version
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
