import React from 'react';
import { FeaturedCategoriesConfig } from '../../../types';
import { FolderCheck } from 'lucide-react';

interface FeaturedCategoriesEditorProps {
  config: FeaturedCategoriesConfig;
  onChange: (updated: FeaturedCategoriesConfig) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessories', label: 'Accessories' }
];

export const FeaturedCategoriesEditor: React.FC<FeaturedCategoriesEditorProps> = ({ config, onChange }) => {
  const selectedCategories = config.categoryIds || ['women', 'men', 'bags', 'shoes', 'accessories'];

  const toggleCategory = (catId: string) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    onChange({ ...config, categoryIds: updated });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white">Featured Categories Settings</h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Select categories to highlight and customize their titles.
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
            placeholder="SHOP BY CATEGORY"
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
            placeholder="Curated luxury edits across all departments"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200">
          Select Active Categories
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition ${
                  isChecked
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-black/10 dark:border-white/10 text-ink-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                {isChecked && <FolderCheck className="w-4 h-4 text-gold-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
