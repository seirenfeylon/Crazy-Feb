import React from 'react';
import { InstagramFeedConfig } from '../../../types';
import { Instagram } from 'lucide-react';

interface InstagramFeedEditorProps {
  config: InstagramFeedConfig;
  onChange: (updated: InstagramFeedConfig) => void;
}

export const InstagramFeedEditor: React.FC<InstagramFeedEditorProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white flex items-center gap-2">
          <Instagram className="w-5 h-5 text-pink-500" /> Instagram Feed Settings
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Connect your Instagram handle, layout grid, and display count.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            placeholder="FOLLOW US ON INSTAGRAM"
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Instagram Account URL / Handle
          </label>
          <input
            type="text"
            value={config.instagramUrl || ''}
            onChange={(e) => onChange({ ...config, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/yourbrand"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Number of Posts ({config.numberOfPosts || 6})
          </label>
          <input
            type="range"
            min={3}
            max={12}
            value={config.numberOfPosts || 6}
            onChange={(e) => onChange({ ...config, numberOfPosts: parseInt(e.target.value) })}
            className="w-full accent-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Grid Layout Columns
          </label>
          <select
            value={config.gridLayout || '6-col'}
            onChange={(e) => onChange({ ...config, gridLayout: e.target.value as any })}
            className="input-lux text-xs py-1.5"
          >
            <option value="3-col">3 Columns</option>
            <option value="4-col">4 Columns</option>
            <option value="6-col">6 Columns</option>
          </select>
        </div>
      </div>
    </div>
  );
};
