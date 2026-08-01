import React from 'react';
import { GlobalSectionStyles } from '../../../types';
import { Sliders, Monitor, Tablet, Smartphone, Palette, Layout } from 'lucide-react';

interface GlobalSectionSettingsEditorProps {
  sectionName: string;
  onNameChange: (newName: string) => void;
  styles: GlobalSectionStyles;
  onChange: (updatedStyles: GlobalSectionStyles) => void;
}

export const GlobalSectionSettingsEditor: React.FC<GlobalSectionSettingsEditorProps> = ({
  sectionName,
  onNameChange,
  styles,
  onChange,
}) => {
  return (
    <div className="space-y-6 bg-ink-50 dark:bg-ink-900/50 p-5 rounded-2xl border border-black/10 dark:border-white/10">
      <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-center justify-between">
        <h4 className="font-semibold text-sm text-ink-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-gold-500" /> Container & Responsive Styles
        </h4>
      </div>

      {/* Section Name */}
      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Internal Section Name
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => onNameChange(e.target.value)}
          className="input-lux text-xs py-1.5"
        />
      </div>

      {/* Device Visibility */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200">
          Device Visibility
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-ink-800 rounded-xl border border-black/5 dark:border-white/10 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={styles.desktopVisible !== false}
              onChange={(e) => onChange({ ...styles, desktopVisible: e.target.checked })}
              className="rounded text-gold-500 focus:ring-gold-500"
            />
            <Monitor className="w-4 h-4 text-ink-600 dark:text-ink-300" />
            <span className="font-medium text-ink-900 dark:text-white">Desktop</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-ink-800 rounded-xl border border-black/5 dark:border-white/10 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={styles.tabletVisible !== false}
              onChange={(e) => onChange({ ...styles, tabletVisible: e.target.checked })}
              className="rounded text-gold-500 focus:ring-gold-500"
            />
            <Tablet className="w-4 h-4 text-ink-600 dark:text-ink-300" />
            <span className="font-medium text-ink-900 dark:text-white">Tablet</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-ink-800 rounded-xl border border-black/5 dark:border-white/10 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={styles.mobileVisible !== false}
              onChange={(e) => onChange({ ...styles, mobileVisible: e.target.checked })}
              className="rounded text-gold-500 focus:ring-gold-500"
            />
            <Smartphone className="w-4 h-4 text-ink-600 dark:text-ink-300" />
            <span className="font-medium text-ink-900 dark:text-white">Mobile</span>
          </label>
        </div>
      </div>

      {/* Container Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-gold-500" /> Container Width
          </label>
          <select
            value={styles.containerWidth || 'normal'}
            onChange={(e) => onChange({ ...styles, containerWidth: e.target.value as any })}
            className="input-lux text-xs py-1.5"
          >
            <option value="narrow">Narrow (max-w-4xl)</option>
            <option value="normal">Normal Luxury (max-w-7xl)</option>
            <option value="wide">Wide Screen (max-w-1440px)</option>
            <option value="full">Full Bleed Edge-to-Edge</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-gold-500" /> Custom Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.backgroundColor || '#000000'}
              onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })}
              className="w-9 h-8 rounded cursor-pointer border border-black/10 dark:border-white/10"
            />
            <input
              type="text"
              value={styles.backgroundColor || ''}
              onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })}
              placeholder="Transparent or #hex"
              className="input-lux text-xs py-1 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Padding Top & Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Top Padding ({styles.paddingTop ?? 48}px)
          </label>
          <input
            type="range"
            min={0}
            max={128}
            step={8}
            value={styles.paddingTop ?? 48}
            onChange={(e) => onChange({ ...styles, paddingTop: parseInt(e.target.value) })}
            className="w-full accent-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Bottom Padding ({styles.paddingBottom ?? 48}px)
          </label>
          <input
            type="range"
            min={0}
            max={128}
            step={8}
            value={styles.paddingBottom ?? 48}
            onChange={(e) => onChange({ ...styles, paddingBottom: parseInt(e.target.value) })}
            className="w-full accent-gold-500"
          />
        </div>
      </div>

      {/* Background Image URL & Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Background Image URL (Optional)
          </label>
          <input
            type="url"
            value={styles.backgroundImage || ''}
            onChange={(e) => onChange({ ...styles, backgroundImage: e.target.value })}
            placeholder="https://..."
            className="input-lux text-xs py-1.5"
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <input
            type="checkbox"
            id="anim-toggle"
            checked={styles.animationEnabled !== false}
            onChange={(e) => onChange({ ...styles, animationEnabled: e.target.checked })}
            className="rounded text-gold-500 focus:ring-gold-500"
          />
          <label htmlFor="anim-toggle" className="text-xs font-medium text-ink-900 dark:text-white cursor-pointer">
            Enable Smooth Scroll Reveal Animation
          </label>
        </div>
      </div>
    </div>
  );
};
