import React from 'react';
import { BrandStoryConfig } from '../../../types';

interface BrandStoryEditorProps {
  config: BrandStoryConfig;
  onChange: (updated: BrandStoryConfig) => void;
}

export const BrandStoryEditor: React.FC<BrandStoryEditorProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white">Brand Story & Heritage</h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Share your brand story, craftsmanship, and heritage image background.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Headline Title
        </label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="CRAFTING TIMELESS ELEGANCE SINCE 2018"
          className="input-lux text-xs py-2"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Story Description
        </label>
        <textarea
          rows={4}
          value={config.description || ''}
          onChange={(e) => onChange({ ...config, description: e.target.value })}
          placeholder="Our atelier bridges traditional European sartorial heritage with modern minimalist design..."
          className="input-lux text-xs py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Background Image URL
          </label>
          <input
            type="url"
            value={config.backgroundImage || ''}
            onChange={(e) => onChange({ ...config, backgroundImage: e.target.value })}
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Founder / Atelier Image URL
          </label>
          <input
            type="url"
            value={config.founderImage || ''}
            onChange={(e) => onChange({ ...config, founderImage: e.target.value })}
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={config.buttonText || ''}
            onChange={(e) => onChange({ ...config, buttonText: e.target.value })}
            placeholder="OUR HERITAGE"
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Button Target Link
          </label>
          <input
            type="text"
            value={config.buttonUrl || ''}
            onChange={(e) => onChange({ ...config, buttonUrl: e.target.value })}
            placeholder="/about"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>
    </div>
  );
};
