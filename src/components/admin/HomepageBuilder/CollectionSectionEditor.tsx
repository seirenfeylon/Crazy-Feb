import React from 'react';
import { CollectionItem, CollectionsConfig } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CollectionSectionEditorProps {
  config: CollectionsConfig;
  onChange: (updated: CollectionsConfig) => void;
}

export const CollectionSectionEditor: React.FC<CollectionSectionEditorProps> = ({ config, onChange }) => {
  const collectionList = config.collections || [];

  const updateItem = (index: number, updatedFields: Partial<CollectionItem>) => {
    const updated = [...collectionList];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange({ ...config, collections: updated });
  };

  const addItem = () => {
    const newItem: CollectionItem = {
      id: `col-${Date.now()}`,
      title: 'New Luxury Collection',
      description: 'Handcrafted capsules tailored for timeless style.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      buttonText: 'EXPLORE',
      buttonUrl: '/collections'
    };
    onChange({ ...config, collections: [...collectionList, newItem] });
  };

  const removeItem = (index: number) => {
    if (collectionList.length <= 1) {
      alert('At least one collection is required.');
      return;
    }
    const updated = collectionList.filter((_, i) => i !== index);
    onChange({ ...config, collections: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h3 className="font-semibold text-base text-ink-900 dark:text-white">Collections Section Settings</h3>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            Create and edit featured seasonal collections.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1.5 bg-gold-500 text-black font-semibold rounded-lg text-xs hover:bg-gold-400 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Collection
        </button>
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
            placeholder="SEASONAL COLLECTIONS"
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
            placeholder="Hand-selected themes crafted with timeless aesthetic"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        {collectionList.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-4 bg-white dark:bg-ink-800 rounded-xl border border-black/10 dark:border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-gold-500 uppercase tracking-wider">
                Collection #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1 text-red-400 hover:text-red-500 rounded hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Collection Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={item.image}
                  onChange={(e) => updateItem(idx, { image: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                Description
              </label>
              <textarea
                rows={2}
                value={item.description || ''}
                onChange={(e) => updateItem(idx, { description: e.target.value })}
                className="input-lux text-xs py-1.5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Button Text
                </label>
                <input
                  type="text"
                  value={item.buttonText || ''}
                  onChange={(e) => updateItem(idx, { buttonText: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Button URL
                </label>
                <input
                  type="text"
                  value={item.buttonUrl || ''}
                  onChange={(e) => updateItem(idx, { buttonUrl: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
