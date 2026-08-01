import React from 'react';
import { FeaturedProductsConfig } from '../../../types';
import { useStore } from '../../../store';

interface FeaturedProductsEditorProps {
  config: FeaturedProductsConfig;
  onChange: (updated: FeaturedProductsConfig) => void;
}

export const FeaturedProductsEditor: React.FC<FeaturedProductsEditorProps> = ({ config, onChange }) => {
  const { products } = useStore();

  const handleManualProductToggle = (id: string) => {
    const current = config.manualProductIds || [];
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onChange({ ...config, manualProductIds: updated });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white">Featured Products Settings</h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Configure product display rules, columns layout, and manual product selection.
        </p>
      </div>

      {/* Section Title & Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            placeholder="e.g. NEW ARRIVALS or FEATURED SELECTION"
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Section Subtitle
          </label>
          <input
            type="text"
            value={config.subtitle || ''}
            onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
            placeholder="e.g. Discover our curated collection"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      {/* Source Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200">
          Product Source Rule
        </label>
        <select
          value={config.sourceType || 'automatic_newest'}
          onChange={(e) => onChange({ ...config, sourceType: e.target.value as any })}
          className="input-lux text-xs py-2"
        >
          <option value="automatic_newest">Automatic: Newest Products</option>
          <option value="automatic_bestseller">Automatic: Best Sellers</option>
          <option value="automatic_views">Automatic: Most Viewed / Reviewed</option>
          <option value="automatic_rated">Automatic: Highest Rated (4.5+ ★)</option>
          <option value="manual">Manual Product Selection</option>
        </select>
      </div>

      {/* Manual Selection Picker */}
      {config.sourceType === 'manual' && (
        <div className="p-4 bg-ink-50 dark:bg-ink-900/50 rounded-xl border border-black/5 dark:border-white/10 space-y-3">
          <label className="block text-xs font-medium text-ink-900 dark:text-white">
            Select Products to Feature ({config.manualProductIds?.length || 0} selected)
          </label>
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-2">
            {products.map((p) => {
              const isSelected = config.manualProductIds?.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-medium'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-ink-700 dark:text-ink-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleManualProductToggle(p.id)}
                      className="rounded text-gold-500 focus:ring-gold-500"
                    />
                    <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <span className="shrink-0 text-ink-400 font-mono">${p.price}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Layout Columns & Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Max Products to Display ({config.maxProducts || 8})
          </label>
          <input
            type="range"
            min={2}
            max={24}
            step={2}
            value={config.maxProducts || 8}
            onChange={(e) => onChange({ ...config, maxProducts: parseInt(e.target.value) || 8 })}
            className="w-full accent-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Desktop Columns
          </label>
          <select
            value={config.desktopColumns || 4}
            onChange={(e) => onChange({ ...config, desktopColumns: parseInt(e.target.value) as any })}
            className="input-lux text-xs py-1.5"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
            <option value={5}>5 Columns</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Mobile Columns
          </label>
          <select
            value={config.mobileColumns || 2}
            onChange={(e) => onChange({ ...config, mobileColumns: parseInt(e.target.value) as any })}
            className="input-lux text-xs py-1.5"
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
          </select>
        </div>
      </div>
    </div>
  );
};
