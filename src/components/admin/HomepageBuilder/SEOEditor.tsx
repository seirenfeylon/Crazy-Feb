import React from 'react';
import { HomepageSEOConfig } from '../../../types';
import { Search, Share2, Globe } from 'lucide-react';

interface SEOEditorProps {
  seo?: HomepageSEOConfig;
  onChange: (updatedSeo: HomepageSEOConfig) => void;
}

export const SEOEditor: React.FC<SEOEditorProps> = ({ seo, onChange }) => {
  const currentSeo: HomepageSEOConfig = seo || {
    metaTitle: 'Maison CrazyFeb — Haute Couture & Luxury Fashion',
    metaDescription: 'Discover hand-tailored luxury garments, cashmere coats, and artisanal leather accessories.',
    ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    twitterCard: 'summary_large_image'
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-gold-500" /> Homepage SEO & Social Sharing Settings
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Optimize search engine title tags, meta descriptions, and social media OpenGraph cards.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          SEO Meta Title Tag (Recommended length: 50-60 characters)
        </label>
        <input
          type="text"
          value={currentSeo.metaTitle}
          onChange={(e) => onChange({ ...currentSeo, metaTitle: e.target.value })}
          className="input-lux text-xs py-2"
        />
        <div className="text-[10px] text-ink-400 mt-1 text-right">
          {currentSeo.metaTitle.length} chars
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          SEO Meta Description Tag (Recommended length: 120-160 characters)
        </label>
        <textarea
          rows={3}
          value={currentSeo.metaDescription}
          onChange={(e) => onChange({ ...currentSeo, metaDescription: e.target.value })}
          className="input-lux text-xs py-2"
        />
        <div className="text-[10px] text-ink-400 mt-1 text-right">
          {currentSeo.metaDescription.length} chars
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-gold-500" /> OpenGraph Social Image URL
          </label>
          <input
            type="url"
            value={currentSeo.ogImage || ''}
            onChange={(e) => onChange({ ...currentSeo, ogImage: e.target.value })}
            placeholder="https://..."
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Twitter Card Type
          </label>
          <select
            value={currentSeo.twitterCard || 'summary_large_image'}
            onChange={(e) => onChange({ ...currentSeo, twitterCard: e.target.value as any })}
            className="input-lux text-xs py-2"
          >
            <option value="summary_large_image">Summary Card with Large Image</option>
            <option value="summary">Standard Summary Card</option>
          </select>
        </div>
      </div>

      {/* Google Search Live Preview */}
      <div className="p-4 bg-white dark:bg-ink-900 rounded-xl border border-black/10 dark:border-white/10 space-y-1">
        <div className="text-[10px] uppercase font-bold text-ink-400 tracking-wider mb-2 flex items-center gap-1">
          <Search className="w-3 h-3 text-gold-500" /> Search Engine Result Snippet Preview
        </div>
        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer truncate">
          {currentSeo.metaTitle || 'Homepage Title'}
        </div>
        <div className="text-emerald-700 dark:text-emerald-400 text-xs truncate">
          https://crazyfeb.com
        </div>
        <div className="text-xs text-ink-600 dark:text-ink-300 line-clamp-2 mt-1">
          {currentSeo.metaDescription || 'Homepage description snippet...'}
        </div>
      </div>
    </div>
  );
};
