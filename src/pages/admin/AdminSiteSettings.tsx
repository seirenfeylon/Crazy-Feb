import { useState, useEffect } from 'react';
import {
  Megaphone,
  Tag,
  Truck,
  Phone,
  Share2,
  ListCollapse,
  Search,
  Store,
  Home,
  Sliders,
  Save,
  RotateCcw
} from 'lucide-react';
import { useStore, DEFAULT_SITE_SETTINGS } from '../../store';
import type { SiteSettings } from '../../types';

type TabId =
  | 'announcement'
  | 'promo'
  | 'delivery'
  | 'contact'
  | 'social'
  | 'footer'
  | 'seo'
  | 'store'
  | 'homepage'
  | 'flags';

interface TabItem {
  id: TabId;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

export default function AdminSiteSettings() {
  const { siteSettings, updateSiteSettings, resetSiteSettings, toast } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('announcement');
  const [draft, setDraft] = useState<SiteSettings>({ ...siteSettings });
  const [saving, setSaving] = useState(false);

  // Sync state if props change (e.g. from firestore listener)
  const syncWithStore = () => {
    setDraft({ ...siteSettings });
  };

  useEffect(() => {
    setDraft({ ...siteSettings });
  }, [siteSettings]);

  const tabs: TabItem[] = [
    {
      id: 'announcement',
      label: 'Announcement Bar',
      desc: 'Top marquee banner controls',
      icon: <Megaphone size={18} />,
    },
    {
      id: 'promo',
      label: 'Promo Banner',
      desc: 'Campaign banner details',
      icon: <Tag size={18} />,
    },
    {
      id: 'delivery',
      label: 'Delivery Info',
      desc: 'Shipping, returns & COD',
      icon: <Truck size={18} />,
    },
    {
      id: 'contact',
      label: 'Contact Details',
      desc: 'Support, WhatsApp & address',
      icon: <Phone size={18} />,
    },
    {
      id: 'social',
      label: 'Social Media',
      desc: 'Facebook, Instagram & X links',
      icon: <Share2 size={18} />,
    },
    {
      id: 'footer',
      label: 'Footer Content',
      desc: 'Copyright, small print & bio',
      icon: <ListCollapse size={18} />,
    },
    {
      id: 'seo',
      label: 'SEO Metadata',
      desc: 'Search ranking & OpenGraph',
      icon: <Search size={18} />,
    },
    {
      id: 'store',
      label: 'Store Config',
      desc: 'Currency, country & language',
      icon: <Store size={18} />,
    },
    {
      id: 'homepage',
      label: 'Homepage Texts',
      desc: 'Hero titles & section titles',
      icon: <Home size={18} />,
    },
    {
      id: 'flags',
      label: 'Feature Flags',
      desc: 'Enable/disable homepage blocks',
      icon: <Sliders size={18} />,
    },
  ];

  const updateField = (key: keyof SiteSettings, value: any) => {
    setDraft((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Compare draft with siteSettings to check for changes
    const hasChanges = JSON.stringify(draft) !== JSON.stringify(siteSettings);
    if (!hasChanges) {
      toast('ℹ️ No changes to save.');
      return;
    }

    setSaving(true);
    try {
      await updateSiteSettings(draft);
      toast('✅ Settings saved successfully.');
    } catch (err) {
      console.error(err);
      toast('❌ Failed to save settings.\nPlease try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset current section to default
  const resetCurrentSection = () => {
    const keysMap: Record<TabId, (keyof SiteSettings)[]> = {
      announcement: [
        'announcementEnable',
        'announcementText',
        'announcementAutoScroll',
        'announcementScrollSpeed',
        'announcementBgColor',
        'announcementTextColor',
      ],
      promo: ['promoEnable', 'promoTitle', 'promoSubtitle', 'promoBtnText', 'promoBtnLink'],
      delivery: ['deliveryFreeShippingText', 'deliveryTime', 'deliveryReturnPolicy', 'deliveryCodText'],
      contact: [
        'contactPhone',
        'contactWhatsApp',
        'contactEmailSupport',
        'contactEmailBusiness',
        'contactAddress',
        'contactHours',
      ],
      social: [
        'socialFacebook',
        'socialInstagram',
        'socialTikTok',
        'socialYouTube',
        'socialLinkedIn',
        'socialTwitter',
      ],
      footer: ['footerCopyright', 'footerDescription', 'footerSmallNotice'],
      seo: ['seoTitle', 'seoMetaDescription', 'seoMetaKeywords', 'seoOgTitle', 'seoOgDescription'],
      store: ['storeName', 'storeCurrency', 'storeCountry', 'storeLanguageDefault', 'storeTimezone'],
      homepage: [
        'heroTitle',
        'heroSubtitle',
        'heroBtnText',
        'heroBtnLink',
        'featuredSectionTitle',
        'newArrivalTitle',
        'bestSellerTitle',
      ],
      flags: [
        'flagShowAnnouncement',
        'flagShowPromoBanner',
        'flagShowTestimonials',
        'flagShowNewsletter',
        'flagShowBrands',
        'flagShowInstagramFeed',
        'flagShowContactForm',
      ],
    };

    const keysToReset = keysMap[activeTab];
    const updated = { ...draft };
    keysToReset.forEach((k) => {
      (updated as any)[k] = DEFAULT_SITE_SETTINGS[k];
    });
    setDraft(updated);
  };

  const resetAll = async () => {
    if (confirm('Are you sure you want to reset ALL settings to system defaults?')) {
      await resetSiteSettings();
      setDraft({ ...DEFAULT_SITE_SETTINGS });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            Configure global storefront content, contact information, metadata, and feature toggles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={syncWithStore}
            className="btn-ghost !py-2 !px-4 text-xs"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="btn-ghost !py-2 !px-4 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Reset All
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left tabs selection */}
        <aside className="space-y-1">
          {tabs.map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
                  isSel
                    ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900 shadow-soft'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span className={isSel ? 'text-gold-400 dark:text-gold-500' : 'text-gold-500'}>
                  {tab.icon}
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className={`text-[10px] ${isSel ? 'text-white/70 dark:text-ink-500' : 'text-ink-400'}`}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Tab Form Fields */}
        <main className="card-lux p-6 sm:p-8 space-y-6">
          {/* Active Tab Header */}
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-300">
                {tabs.find((t) => t.id === activeTab)?.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={resetCurrentSection}
              className="inline-flex items-center gap-1 text-xs text-gold-600 dark:text-gold-300 hover:underline"
            >
              <RotateCcw size={12} /> Reset to Default
            </button>
          </div>

          {/* Section Fields */}
          <div className="space-y-4">
            {activeTab === 'announcement' && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draft.announcementEnable}
                    onChange={(e) => updateField('announcementEnable', e.target.checked)}
                    className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                  />
                  <div>
                    <div className="text-sm font-semibold">Enable Announcement Bar</div>
                    <div className="text-xs text-ink-400">Show or hide the top-most bar on all client pages.</div>
                  </div>
                </label>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Announcement Text
                  </label>
                  <textarea
                    rows={3}
                    value={draft.announcementText}
                    onChange={(e) => updateField('announcementText', e.target.value)}
                    placeholder="E.g. Free shipping over ৳15,000 • use WELCOME for 20% off"
                    className="input-lux"
                  />
                  <p className="text-[10px] text-ink-400 mt-1">
                    Separate banner items using a bullet point (•) or a semicolon (;).
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={draft.announcementAutoScroll}
                      onChange={(e) => updateField('announcementAutoScroll', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Auto Scroll</div>
                      <div className="text-xs text-ink-400">Animate text horizontally.</div>
                    </div>
                  </label>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Scroll Speed (1-50)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={draft.announcementScrollSpeed}
                      onChange={(e) => updateField('announcementScrollSpeed', parseInt(e.target.value) || 15)}
                      className="input-lux"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Background Color (Hex)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Default white/dark bg"
                        value={draft.announcementBgColor}
                        onChange={(e) => updateField('announcementBgColor', e.target.value)}
                        className="input-lux"
                      />
                      {draft.announcementBgColor && (
                        <div
                          className="h-11 w-11 rounded-xl border border-black/15 shadow-sm"
                          style={{ backgroundColor: draft.announcementBgColor }}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Text Color (Hex)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Default text"
                        value={draft.announcementTextColor}
                        onChange={(e) => updateField('announcementTextColor', e.target.value)}
                        className="input-lux"
                      />
                      {draft.announcementTextColor && (
                        <div
                          className="h-11 w-11 rounded-xl border border-black/15 shadow-sm"
                          style={{ backgroundColor: draft.announcementTextColor }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'promo' && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draft.promoEnable}
                    onChange={(e) => updateField('promoEnable', e.target.checked)}
                    className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                  />
                  <div>
                    <div className="text-sm font-semibold">Enable Promo Banner</div>
                    <div className="text-xs text-ink-400">Show or hide the home page limited campaign banner.</div>
                  </div>
                </label>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={draft.promoTitle}
                    onChange={(e) => updateField('promoTitle', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Banner Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={draft.promoSubtitle}
                    onChange={(e) => updateField('promoSubtitle', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={draft.promoBtnText}
                      onChange={(e) => updateField('promoBtnText', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Button Link (Collection ID or route)
                    </label>
                    <input
                      type="text"
                      value={draft.promoBtnLink}
                      onChange={(e) => updateField('promoBtnLink', e.target.value)}
                      placeholder="e.g. gilded-hour"
                      className="input-lux"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Free Shipping Notice
                    </label>
                    <input
                      type="text"
                      value={draft.deliveryFreeShippingText}
                      onChange={(e) => updateField('deliveryFreeShippingText', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={draft.deliveryTime}
                      onChange={(e) => updateField('deliveryTime', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Return Policy Text
                    </label>
                    <input
                      type="text"
                      value={draft.deliveryReturnPolicy}
                      onChange={(e) => updateField('deliveryReturnPolicy', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Cash On Delivery Text
                    </label>
                    <input
                      type="text"
                      value={draft.deliveryCodText}
                      onChange={(e) => updateField('deliveryCodText', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={draft.contactPhone}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={draft.contactWhatsApp}
                      onChange={(e) => updateField('contactWhatsApp', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={draft.contactEmailSupport}
                      onChange={(e) => updateField('contactEmailSupport', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Business Inquiry Email
                    </label>
                    <input
                      type="email"
                      value={draft.contactEmailBusiness}
                      onChange={(e) => updateField('contactEmailBusiness', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Store Address
                  </label>
                  <textarea
                    rows={2}
                    value={draft.contactAddress}
                    onChange={(e) => updateField('contactAddress', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={draft.contactHours}
                    onChange={(e) => updateField('contactHours', e.target.value)}
                    placeholder="e.g. Sat - Thu: 10:00 AM - 08:00 PM"
                    className="input-lux"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialFacebook}
                    onChange={(e) => updateField('socialFacebook', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialInstagram}
                    onChange={(e) => updateField('socialInstagram', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    TikTok URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialTikTok}
                    onChange={(e) => updateField('socialTikTok', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialYouTube}
                    onChange={(e) => updateField('socialYouTube', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialLinkedIn}
                    onChange={(e) => updateField('socialLinkedIn', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={draft.socialTwitter}
                    onChange={(e) => updateField('socialTwitter', e.target.value)}
                    className="input-lux"
                  />
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Footer Copyright Line
                  </label>
                  <input
                    type="text"
                    value={draft.footerCopyright}
                    onChange={(e) => updateField('footerCopyright', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Footer Brand Bio / Description
                  </label>
                  <textarea
                    rows={3}
                    value={draft.footerDescription}
                    onChange={(e) => updateField('footerDescription', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Footer Small Notice (Payment/Trust badge line)
                  </label>
                  <input
                    type="text"
                    value={draft.footerSmallNotice}
                    onChange={(e) => updateField('footerSmallNotice', e.target.value)}
                    placeholder="E.g. Visa • Mastercard • PayPal"
                    className="input-lux"
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Website Browser Title
                  </label>
                  <input
                    type="text"
                    value={draft.seoTitle}
                    onChange={(e) => updateField('seoTitle', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    rows={2}
                    value={draft.seoMetaDescription}
                    onChange={(e) => updateField('seoMetaDescription', e.target.value)}
                    className="input-lux"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                    Meta Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={draft.seoMetaKeywords}
                    onChange={(e) => updateField('seoMetaKeywords', e.target.value)}
                    placeholder="fashion, brand, luxury"
                    className="input-lux"
                  />
                </div>

                <div className="border-t border-black/5 dark:border-white/10 pt-4 mt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-gold-600 dark:text-gold-300">
                    OpenGraph Social Sharing
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        OpenGraph Share Title
                      </label>
                      <input
                        type="text"
                        value={draft.seoOgTitle}
                        onChange={(e) => updateField('seoOgTitle', e.target.value)}
                        className="input-lux"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        OpenGraph Share Description
                      </label>
                      <textarea
                        rows={2}
                        value={draft.seoOgDescription}
                        onChange={(e) => updateField('seoOgDescription', e.target.value)}
                        className="input-lux"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Store Brand Name
                    </label>
                    <input
                      type="text"
                      value={draft.storeName}
                      onChange={(e) => updateField('storeName', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={draft.storeCurrency}
                      onChange={(e) => updateField('storeCurrency', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Store Country
                    </label>
                    <input
                      type="text"
                      value={draft.storeCountry}
                      onChange={(e) => updateField('storeCountry', e.target.value)}
                      className="input-lux"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Default Language
                    </label>
                    <select
                      value={draft.storeLanguageDefault}
                      onChange={(e) => updateField('storeLanguageDefault', e.target.value)}
                      className="input-lux"
                    >
                      <option value="en">English (en)</option>
                      <option value="bn">Bangla (bn)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={draft.storeTimezone}
                      onChange={(e) => updateField('storeTimezone', e.target.value)}
                      className="input-lux"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'homepage' && (
              <div className="space-y-4">
                <div className="border-b border-black/5 dark:border-white/10 pb-4 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-300 mb-3">
                    Hero Section (Curated Collections banner)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={draft.heroTitle}
                          onChange={(e) => updateField('heroTitle', e.target.value)}
                          className="input-lux"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                          Hero Button Text
                        </label>
                        <input
                          type="text"
                          value={draft.heroBtnText}
                          onChange={(e) => updateField('heroBtnText', e.target.value)}
                          className="input-lux"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Hero Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={draft.heroSubtitle}
                        onChange={(e) => updateField('heroSubtitle', e.target.value)}
                        className="input-lux"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Hero Button Link (Route or page)
                      </label>
                      <input
                        type="text"
                        value={draft.heroBtnLink}
                        onChange={(e) => updateField('heroBtnLink', e.target.value)}
                        placeholder="e.g. collections"
                        className="input-lux"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-300">
                    Product Grid Titles
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Featured Section Title
                      </label>
                      <input
                        type="text"
                        value={draft.featuredSectionTitle}
                        onChange={(e) => updateField('featuredSectionTitle', e.target.value)}
                        className="input-lux"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        New Arrivals Section Title
                      </label>
                      <input
                        type="text"
                        value={draft.newArrivalTitle}
                        onChange={(e) => updateField('newArrivalTitle', e.target.value)}
                        className="input-lux"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Best Sellers Section Title
                      </label>
                      <input
                        type="text"
                        value={draft.bestSellerTitle}
                        onChange={(e) => updateField('bestSellerTitle', e.target.value)}
                        className="input-lux"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flags' && (
              <div className="space-y-3">
                <p className="text-xs text-ink-400 mb-4">
                  Quickly toggle visibility for different landing modules on the main store page.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowAnnouncement}
                      onChange={(e) => updateField('flagShowAnnouncement', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Announcement Bar</div>
                      <div className="text-[10px] text-ink-400">Marquee notice at very top</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowPromoBanner}
                      onChange={(e) => updateField('flagShowPromoBanner', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Promo Banner</div>
                      <div className="text-[10px] text-ink-400">Campaign advertisement section</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowTestimonials}
                      onChange={(e) => updateField('flagShowTestimonials', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Testimonials</div>
                      <div className="text-[10px] text-ink-400">Client satisfaction reviews</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowNewsletter}
                      onChange={(e) => updateField('flagShowNewsletter', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Newsletter Box</div>
                      <div className="text-[10px] text-ink-400">Email sign-up subscription block</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowBrands}
                      onChange={(e) => updateField('flagShowBrands', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Categories Grid</div>
                      <div className="text-[10px] text-ink-400">Premium apparel categories block</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowInstagramFeed}
                      onChange={(e) => updateField('flagShowInstagramFeed', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Instagram Feed</div>
                      <div className="text-[10px] text-ink-400">Social gallery list</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagShowContactForm}
                      onChange={(e) => updateField('flagShowContactForm', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Show Contact Form</div>
                      <div className="text-[10px] text-ink-400">Form on the contact page</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-3 border-t border-black/5 dark:border-white/10 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-dark inline-flex items-center gap-2 !py-2.5 !px-5 text-sm"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </main>
      </form>
    </div>
  );
}
