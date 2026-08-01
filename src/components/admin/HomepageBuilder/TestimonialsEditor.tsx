import React from 'react';
import { TestimonialItem, TestimonialsConfig } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

interface TestimonialsEditorProps {
  config: TestimonialsConfig;
  onChange: (updated: TestimonialsConfig) => void;
}

export const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ config, onChange }) => {
  const items = config.items || [];

  const updateItem = (index: number, updatedFields: Partial<TestimonialItem>) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange({ ...config, items: updated });
  };

  const addItem = () => {
    const newItem: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: 'Client Name',
      position: 'Fashion Lover, Milan',
      rating: 5,
      review: 'Exceptional craftsmanship and swift global delivery.',
      customerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    };
    onChange({ ...config, items: [...items, newItem] });
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      alert('At least one testimonial is required.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange({ ...config, items: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h3 className="font-semibold text-base text-ink-900 dark:text-white">Testimonials & Client Reviews</h3>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            Manage customer reviews, ratings, and quotes displayed on the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1.5 bg-gold-500 text-black font-semibold rounded-lg text-xs hover:bg-gold-400 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
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
            placeholder="WHAT OUR CLIENTS SAY"
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
            placeholder="Authentic reviews from verified buyers"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-4 bg-white dark:bg-ink-800 rounded-xl border border-black/10 dark:border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-gold-500 uppercase tracking-wider">
                Review #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1 text-red-400 hover:text-red-500 rounded hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Role / Location
                </label>
                <input
                  type="text"
                  value={item.position || ''}
                  onChange={(e) => updateItem(idx, { position: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={item.rating || 5}
                  onChange={(e) => updateItem(idx, { rating: parseInt(e.target.value) })}
                  className="input-lux text-xs py-1.5"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-ink-600 dark:text-ink-300 mb-0.5">
                Review Quote text
              </label>
              <textarea
                rows={2}
                value={item.review}
                onChange={(e) => updateItem(idx, { review: e.target.value })}
                className="input-lux text-xs py-1.5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
