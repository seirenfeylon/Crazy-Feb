import React from 'react';
import { HeroBannerConfig, HeroSlide } from '../../../types';
import { Plus, Trash2, Image, Link, Clock } from 'lucide-react';

interface HeroBannerEditorProps {
  config: HeroBannerConfig;
  onChange: (updated: HeroBannerConfig) => void;
}

export const HeroBannerEditor: React.FC<HeroBannerEditorProps> = ({ config, onChange }) => {
  const slides = config.slides || [];

  const updateSlide = (index: number, updatedFields: Partial<HeroSlide>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...updatedFields };
    onChange({ ...config, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      desktopImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      mobileImage: '',
      headline: 'NEW SEASON ARRIVALS',
      subheadline: 'Crafted with passion and timeless precision.',
      buttonText: 'SHOP NOW',
      buttonUrl: '/shop',
      overlayOpacity: 40,
      textAlignment: 'center',
      animationStyle: 'fade',
      displayOrder: slides.length + 1,
      enabled: true
    };
    onChange({ ...config, slides: [...slides, newSlide] });
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('Hero Banner must contain at least one slide.');
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    onChange({ ...config, slides: newSlides });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h3 className="font-semibold text-base text-ink-900 dark:text-white">Hero Slides Management</h3>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            Configure images, typography, CTA buttons, and timing for full-width hero slider.
          </p>
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="px-3 py-1.5 bg-gold-500 text-black font-semibold rounded-lg text-xs hover:bg-gold-400 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {/* Auto rotation settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-ink-50 dark:bg-ink-900/50 p-4 rounded-xl border border-black/5 dark:border-white/10">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.autoRotate ?? true}
            onChange={(e) => onChange({ ...config, autoRotate: e.target.checked })}
            className="rounded border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-500"
          />
          <span className="text-sm font-medium text-ink-900 dark:text-white">Auto-rotate slides</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-500 dark:text-ink-300 shrink-0">Interval (sec):</span>
          <input
            type="number"
            min={2}
            max={30}
            value={config.rotationInterval || 6}
            onChange={(e) => onChange({ ...config, rotationInterval: parseInt(e.target.value) || 6 })}
            className="input-lux text-xs py-1 px-2 w-20"
          />
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-6">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="p-5 bg-white dark:bg-ink-800 rounded-2xl border border-black/10 dark:border-white/10 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-medium text-sm text-ink-900 dark:text-white">
                  Slide #{idx + 1} ({slide.headline || 'Untitled'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSlide(idx)}
                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                title="Delete Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-gold-500" /> Desktop Image URL *
                </label>
                <input
                  type="url"
                  value={slide.desktopImage}
                  onChange={(e) => updateSlide(idx, { desktopImage: e.target.value })}
                  placeholder="https://..."
                  className="input-lux text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-gold-500" /> Mobile Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={slide.mobileImage || ''}
                  onChange={(e) => updateSlide(idx, { mobileImage: e.target.value })}
                  placeholder="https://..."
                  className="input-lux text-xs py-2"
                />
              </div>
            </div>

            {/* Headline & Subheadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={slide.headline}
                  onChange={(e) => updateSlide(idx, { headline: e.target.value })}
                  className="input-lux text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Subheadline
                </label>
                <input
                  type="text"
                  value={slide.subheadline || ''}
                  onChange={(e) => updateSlide(idx, { subheadline: e.target.value })}
                  className="input-lux text-xs py-2"
                />
              </div>
            </div>

            {/* Button Text & Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={slide.buttonText || ''}
                  onChange={(e) => updateSlide(idx, { buttonText: e.target.value })}
                  className="input-lux text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-gold-500" /> Button URL / Route
                </label>
                <input
                  type="text"
                  value={slide.buttonUrl || ''}
                  onChange={(e) => updateSlide(idx, { buttonUrl: e.target.value })}
                  placeholder="/shop or /collections"
                  className="input-lux text-xs py-2"
                />
              </div>
            </div>

            {/* Styling & Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-black/5 dark:border-white/10">
              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Overlay Dark Opacity ({slide.overlayOpacity ?? 40}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slide.overlayOpacity ?? 40}
                  onChange={(e) => updateSlide(idx, { overlayOpacity: parseInt(e.target.value) })}
                  className="w-full accent-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Text Alignment
                </label>
                <select
                  value={slide.textAlignment || 'center'}
                  onChange={(e) => updateSlide(idx, { textAlignment: e.target.value as any })}
                  className="input-lux text-xs py-1.5"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
                  Animation Style
                </label>
                <select
                  value={slide.animationStyle || 'fade'}
                  onChange={(e) => updateSlide(idx, { animationStyle: e.target.value as any })}
                  className="input-lux text-xs py-1.5"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/10">
              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold-500" /> Schedule Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={slide.scheduleStart || ''}
                  onChange={(e) => updateSlide(idx, { scheduleStart: e.target.value })}
                  className="input-lux text-xs py-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold-500" /> Schedule End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={slide.scheduleEnd || ''}
                  onChange={(e) => updateSlide(idx, { scheduleEnd: e.target.value })}
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
