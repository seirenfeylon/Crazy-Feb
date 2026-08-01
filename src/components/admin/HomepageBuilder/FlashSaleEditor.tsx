import React from 'react';
import { FlashSaleConfig } from '../../../types';
import { Flame, Clock, Palette } from 'lucide-react';

interface FlashSaleEditorProps {
  config: FlashSaleConfig;
  onChange: (updated: FlashSaleConfig) => void;
}

export const FlashSaleEditor: React.FC<FlashSaleEditorProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" /> Flash Sale Banner Settings
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Configure countdown timer, promotional announcement, and background theme.
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
        <input
          type="checkbox"
          checked={config.enabled ?? true}
          onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
          className="rounded text-amber-500 focus:ring-amber-500"
        />
        <span className="text-sm font-semibold text-amber-200">Enable Flash Sale Countdown Banner</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Flash Sale Title
          </label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            placeholder="Flash Sale — up to 40% off"
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-gold-500" /> Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={config.backgroundColor || '#111827'}
              onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
              className="w-10 h-9 rounded cursor-pointer border border-black/10 dark:border-white/10"
            />
            <input
              type="text"
              value={config.backgroundColor || '#111827'}
              onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
              className="input-lux text-xs py-1.5 flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Announcement Message
        </label>
        <textarea
          rows={2}
          value={config.announcement || ''}
          onChange={(e) => onChange({ ...config, announcement: e.target.value })}
          placeholder="A curated edit of luxury pieces at exceptional prices. Limited time only."
          className="input-lux text-xs py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/10">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold-500" /> Start Date / Time
          </label>
          <input
            type="datetime-local"
            value={config.startDate || ''}
            onChange={(e) => onChange({ ...config, startDate: e.target.value })}
            className="input-lux text-xs py-1.5"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold-500" /> End Date / Time
          </label>
          <input
            type="datetime-local"
            value={config.endDate || ''}
            onChange={(e) => onChange({ ...config, endDate: e.target.value })}
            className="input-lux text-xs py-1.5"
          />
        </div>
      </div>
    </div>
  );
};
