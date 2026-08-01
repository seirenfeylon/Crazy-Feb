import React from 'react';
import { NewsletterConfig } from '../../../types';
import { Mail } from 'lucide-react';

interface NewsletterEditorProps {
  config: NewsletterConfig;
  onChange: (updated: NewsletterConfig) => void;
}

export const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-semibold text-base text-ink-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-gold-500" /> Newsletter Subscription Box
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Customize email lead capture titles, button labels, and welcome messages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Headline Title
          </label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            placeholder="JOIN THE MAISON CLUB"
            className="input-lux text-xs py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={config.buttonText || ''}
            onChange={(e) => onChange({ ...config, buttonText: e.target.value })}
            placeholder="SUBSCRIBE"
            className="input-lux text-xs py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Subtitle / Promo Incentive
        </label>
        <textarea
          rows={2}
          value={config.subtitle || ''}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          placeholder="Subscribe to receive private invitations to runway previews and exclusive discounts."
          className="input-lux text-xs py-2"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-700 dark:text-ink-200 mb-1">
          Success Confirmation Message
        </label>
        <input
          type="text"
          value={config.successMessage || ''}
          onChange={(e) => onChange({ ...config, successMessage: e.target.value })}
          placeholder="Thank you for subscribing! Check your inbox for your 10% welcome invitation."
          className="input-lux text-xs py-2"
        />
      </div>
    </div>
  );
};
