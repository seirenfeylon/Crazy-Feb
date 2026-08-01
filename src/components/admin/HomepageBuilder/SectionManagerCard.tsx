import React from 'react';
import { HomepageSectionConfig } from '../../../types';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Settings,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface SectionManagerCardProps {
  section: HomepageSectionConfig;
  index: number;
  totalSections: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggleEnabled: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const SectionManagerCard: React.FC<SectionManagerCardProps> = ({
  section,
  index,
  totalSections,
  isSelected,
  onSelect,
  onToggleEnabled,
  onMoveUp,
  onMoveDown,
}) => {
  const { name, enabled, styles, type } = section;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'border-gold-500/80 bg-gold-500/5 shadow-md shadow-gold-500/10 dark:bg-gold-500/10'
          : 'border-black/10 dark:border-white/10 bg-white dark:bg-ink-800 hover:border-black/20 dark:hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between p-3.5 gap-2">
        {/* Left Drag & Reorder Handle + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col gap-0.5 text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (index > 0) onMoveUp();
              }}
              disabled={index === 0}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30 transition"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <GripVertical className="w-4 h-4 cursor-grab text-ink-400 mx-auto" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (index < totalSections - 1) onMoveDown();
              }}
              disabled={index === totalSections - 1}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30 transition"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onSelect}
            className="text-left flex-1 min-w-0 py-1"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-ink-900 dark:text-white truncate">
                {name || type}
              </span>
              {!enabled && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-red-500/10 text-red-500 dark:bg-red-500/20">
                  Disabled
                </span>
              )}
            </div>

            {/* Visibility icons */}
            <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-400">
              <span className="flex items-center gap-1">
                <Monitor className={`w-3 h-3 ${styles?.desktopVisible !== false ? 'text-gold-500' : 'text-ink-400 opacity-40'}`} />
                <Tablet className={`w-3 h-3 ${styles?.tabletVisible !== false ? 'text-gold-500' : 'text-ink-400 opacity-40'}`} />
                <Smartphone className={`w-3 h-3 ${styles?.mobileVisible !== false ? 'text-gold-500' : 'text-ink-400 opacity-40'}`} />
              </span>
              <span>•</span>
              <span className="uppercase text-[10px] tracking-wider font-mono">
                {type.replace('_', ' ')}
              </span>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleEnabled}
            className={`p-2 rounded-lg transition ${
              enabled
                ? 'text-emerald-500 hover:bg-emerald-500/10'
                : 'text-ink-400 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={enabled ? 'Disable Section' : 'Enable Section'}
          >
            {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onSelect}
            className={`p-2 rounded-lg transition ${
              isSelected
                ? 'bg-gold-500 text-black font-medium'
                : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-ink-700 dark:text-ink-200'
            }`}
            title="Edit Section Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
