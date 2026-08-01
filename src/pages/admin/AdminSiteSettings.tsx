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
  RotateCcw,
  CreditCard,
  Banknote,
  Smartphone,
  Globe,
  CheckCircle2,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  Calculator,
  X,
  AlertTriangle
} from 'lucide-react';
import { HomepageBuilder } from '../../components/admin/HomepageBuilder/HomepageBuilder';
import { useStore, DEFAULT_SITE_SETTINGS } from '../../store';
import type { SiteSettings, PaymentGatewayConfig, DeliveryZoneConfig, DeliveryMethodConfig } from '../../types';

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
  | 'flags'
  | 'payment';

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

  // Shipping zone manager state
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneDistricts, setNewZoneDistricts] = useState('');
  const [newZoneCharge, setNewZoneCharge] = useState<number>(100);
  const [newZoneDelivery, setNewZoneDelivery] = useState('2–3 Days');
  const [newZoneExpress, setNewZoneExpress] = useState(true);
  const [newZoneCod, setNewZoneCod] = useState(true);
  const [zoneValidationError, setZoneValidationError] = useState('');

  // Live Shipping Preview Simulator State
  const [previewSubtotal, setPreviewSubtotal] = useState<number>(2500);
  const [previewDistrict, setPreviewDistrict] = useState<string>('Dhaka');
  const [previewMethod, setPreviewMethod] = useState<string>('std');

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
      label: 'Homepage Builder',
      desc: 'Shopify-style drag & drop builder',
      icon: <Home size={18} />,
    },
    {
      id: 'flags',
      label: 'Feature Flags',
      desc: 'Enable/disable homepage blocks',
      icon: <Sliders size={18} />,
    },
    {
      id: 'payment',
      label: 'Payment Gateways',
      desc: 'bKash, Nagad, COD & Cards',
      icon: <CreditCard size={18} />,
    },
  ];

  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
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
      delivery: [
        'deliveryFreeShippingText',
        'deliveryTime',
        'deliveryReturnPolicy',
        'deliveryCodText',
        'defaultShippingFee',
        'freeShippingThreshold',
        'freeShippingEnabled',
        'freeShippingMessage',
        'shippingCurrency',
        'estimatedDeliveryTime',
        'processingTime',
        'maxDeliveryDays',
        'deliveryZones',
        'deliveryMethods',
        'localPickupEnabled',
        'localPickupAddress',
        'localPickupInstructions',
        'localPickupBusinessHours',
        'localPickupContactNumber',
        'maxOrderWeightKg',
        'restrictedDistricts',
        'disableHolidayDelivery',
        'disableWeekendDelivery',
      ],
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
      payment: ['paymentGateways'],
    };

    const keysToReset = keysMap[activeTab];
    const updated = { ...draft };
    keysToReset.forEach((k) => {
      const key = k as keyof SiteSettings;
      (updated as Record<string, unknown>)[key] = DEFAULT_SITE_SETTINGS[key];
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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
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
              <div className="space-y-6 animate-fade-in">
                {/* Module Header Card */}
                <div className="card-lux p-5 bg-gradient-to-r from-ink-900 to-ink-950 text-white border-gold-400/20">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/20 text-gold-400">
                        <Truck size={24} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">Shipping & Logistics Engine</h3>
                        <p className="text-xs text-ink-300">
                          Configure delivery rates, geographic zones, free shipping thresholds, courier methods, and local showroom pickup.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-semibold">
                      <MapPin size={16} className="text-gold-400" />
                      <span>
                        {(draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || []).filter((z) => z.enabled).length} Active Zones
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1. GENERAL SHIPPING PARAMETERS */}
                <div className="card-lux p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                    <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                      <Clock size={18} className="text-gold-500" />
                      General Shipping & Dispatch Rules
                    </h4>
                    <span className="text-xs text-ink-400 font-mono">Store Currency: BDT (৳)</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Default Base Shipping Charge (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={draft.defaultShippingFee ?? 120}
                        onChange={(e) => updateField('defaultShippingFee', Math.max(0, Number(e.target.value)))}
                        className="input-lux font-bold"
                        placeholder="120"
                      />
                      <p className="mt-1 text-[11px] text-ink-400">Used when no matching zone is detected.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Free Shipping Order Threshold (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={draft.freeShippingThreshold ?? 3000}
                        onChange={(e) => updateField('freeShippingThreshold', Math.max(0, Number(e.target.value)))}
                        className="input-lux font-bold"
                        placeholder="3000"
                      />
                      <p className="mt-1 text-[11px] text-ink-400">Orders above this subtotal ship for ৳0.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Estimated Delivery Time Frame
                      </label>
                      <input
                        type="text"
                        value={draft.deliveryTime || draft.estimatedDeliveryTime || '2–4 Business Days'}
                        onChange={(e) => {
                          updateField('deliveryTime', e.target.value);
                          updateField('estimatedDeliveryTime', e.target.value);
                        }}
                        className="input-lux font-medium"
                        placeholder="2–4 Business Days"
                      />
                      <p className="mt-1 text-[11px] text-ink-400">Displayed across product & checkout pages.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Order Processing / Handling Time
                      </label>
                      <input
                        type="text"
                        value={draft.processingTime || '24 Hours'}
                        onChange={(e) => updateField('processingTime', e.target.value)}
                        className="input-lux font-medium"
                        placeholder="24 Hours"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Maximum Delivery Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={draft.maxDeliveryDays ?? 7}
                        onChange={(e) => updateField('maxDeliveryDays', Math.max(1, Number(e.target.value)))}
                        className="input-lux font-medium"
                        placeholder="7"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Cash On Delivery Notice
                      </label>
                      <input
                        type="text"
                        value={draft.deliveryCodText || 'Available nationwide with courier inspection'}
                        onChange={(e) => updateField('deliveryCodText', e.target.value)}
                        className="input-lux font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. DELIVERY ZONES MANAGER */}
                <div className="card-lux p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                        <MapPin size={18} className="text-gold-500" />
                        Geographic Delivery Zones
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        Map courier rates and estimated delivery timelines by district.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewZoneName('');
                        setNewZoneDistricts('');
                        setNewZoneCharge(100);
                        setNewZoneDelivery('2–3 Days');
                        setNewZoneExpress(true);
                        setNewZoneCod(true);
                        setZoneValidationError('');
                        setShowAddZoneModal(true);
                      }}
                      className="btn-dark py-2 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus size={15} /> Add Delivery Zone
                    </button>
                  </div>

                  {/* Add Zone Modal / Expander */}
                  {showAddZoneModal && (
                    <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 p-4 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                          Create New Delivery Zone
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddZoneModal(false)}
                          className="text-ink-400 hover:text-ink-900 dark:hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {zoneValidationError && (
                        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                          <AlertTriangle size={14} /> {zoneValidationError}
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                            Zone Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sylhet Division"
                            value={newZoneName}
                            onChange={(e) => setNewZoneName(e.target.value)}
                            className="input-lux text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                            Districts / Cities (Comma separated) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sylhet, Moulvibazar, Habiganj"
                            value={newZoneDistricts}
                            onChange={(e) => setNewZoneDistricts(e.target.value)}
                            className="input-lux text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                            Shipping Fee (৳) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="120"
                            value={newZoneCharge}
                            onChange={(e) => setNewZoneCharge(Number(e.target.value))}
                            className="input-lux text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                            Estimated Delivery Time
                          </label>
                          <input
                            type="text"
                            placeholder="2–3 Days"
                            value={newZoneDelivery}
                            onChange={(e) => setNewZoneDelivery(e.target.value)}
                            className="input-lux text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink-700 dark:text-ink-200">
                            <input
                              type="checkbox"
                              checked={newZoneExpress}
                              onChange={(e) => setNewZoneExpress(e.target.checked)}
                              className="h-4 w-4 rounded accent-gold-500"
                            />
                            <span>Express Option</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink-700 dark:text-ink-200">
                            <input
                              type="checkbox"
                              checked={newZoneCod}
                              onChange={(e) => setNewZoneCod(e.target.checked)}
                              className="h-4 w-4 rounded accent-gold-500"
                            />
                            <span>COD Supported</span>
                          </label>
                        </div>

                        <div className="flex items-end justify-end gap-2 pt-2 sm:col-span-2 lg:col-span-1">
                          <button
                            type="button"
                            onClick={() => setShowAddZoneModal(false)}
                            className="btn-ghost py-1.5 px-3 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newZoneName.trim()) {
                                setZoneValidationError('Zone name is required.');
                                return;
                              }
                              if (!newZoneDistricts.trim()) {
                                setZoneValidationError('Please list at least one district.');
                                return;
                              }
                              if (newZoneCharge < 0) {
                                setZoneValidationError('Shipping charge cannot be negative.');
                                return;
                              }

                              const newZoneObj: DeliveryZoneConfig = {
                                id: `zone-${Date.now()}`,
                                name: newZoneName.trim(),
                                districts: newZoneDistricts
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                                charge: newZoneCharge,
                                estimatedDelivery: newZoneDelivery || '2–3 Days',
                                expressAvailable: newZoneExpress,
                                codAvailable: newZoneCod,
                                enabled: true,
                              };

                              const existing = [
                                ...(draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || []),
                              ];
                              updateField('deliveryZones', [...existing, newZoneObj]);
                              setShowAddZoneModal(false);
                              toast('Delivery zone added successfully.');
                            }}
                            className="btn-dark py-1.5 px-3 text-xs font-bold"
                          >
                            Save Zone
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Zones List */}
                  <div className="space-y-3">
                    {(draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || []).map((zone, idx) => {
                      const updateZone = (updates: Partial<DeliveryZoneConfig>) => {
                        const current = [
                          ...(draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || []),
                        ];
                        current[idx] = { ...current[idx], ...updates };
                        updateField('deliveryZones', current);
                      };

                      const deleteZone = () => {
                        if (confirm(`Are you sure you want to delete "${zone.name}"?`)) {
                          const current = [
                            ...(draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || []),
                          ];
                          current.splice(idx, 1);
                          updateField('deliveryZones', current);
                          toast('Zone removed.');
                        }
                      };

                      return (
                        <div
                          key={zone.id || idx}
                          className={`rounded-2xl border p-4 transition-all ${
                            zone.enabled
                              ? 'border-black/10 dark:border-white/10 bg-white dark:bg-ink-800'
                              : 'border-dashed border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 opacity-70'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={zone.enabled}
                                  onChange={(e) => updateZone({ enabled: e.target.checked })}
                                  className="h-4 w-4 rounded accent-gold-500"
                                />
                                <span className="font-display text-sm font-bold text-ink-900 dark:text-white">
                                  {zone.name}
                                </span>
                              </label>

                              <span className="rounded-md bg-gold-400/15 px-2.5 py-0.5 text-xs font-extrabold text-gold-600 dark:text-gold-400">
                                ৳{zone.charge}
                              </span>

                              <span className="text-xs font-semibold text-ink-500">
                                ({zone.estimatedDelivery})
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1 text-[11px] font-semibold text-ink-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={zone.expressAvailable}
                                  onChange={(e) => updateZone({ expressAvailable: e.target.checked })}
                                  className="h-3.5 w-3.5 rounded accent-gold-500"
                                />
                                Express
                              </label>

                              <label className="flex items-center gap-1 text-[11px] font-semibold text-ink-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={zone.codAvailable}
                                  onChange={(e) => updateZone({ codAvailable: e.target.checked })}
                                  className="h-3.5 w-3.5 rounded accent-gold-500"
                                />
                                COD
                              </label>

                              <button
                                type="button"
                                onClick={deleteZone}
                                className="text-rose-500 hover:text-rose-700 p-1"
                                title="Delete Zone"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Districts Pills */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                            <span className="text-[11px] font-bold text-ink-400 mr-1">Districts:</span>
                            {zone.districts.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="rounded-lg bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-ink-700 dark:text-ink-200"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. DELIVERY METHODS */}
                <div className="card-lux p-5 space-y-4">
                  <div className="border-b border-black/5 dark:border-white/10 pb-3">
                    <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                      <Truck size={18} className="text-gold-500" />
                      Delivery Methods & Shipping Speed Options
                    </h4>
                    <p className="text-xs text-ink-500 dark:text-ink-300">
                      Enable, disable, or customize shipping speed options available to customers during checkout.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {(draft.deliveryMethods || DEFAULT_SITE_SETTINGS.deliveryMethods || []).map((method, idx) => {
                      const updateMethod = (updates: Partial<DeliveryMethodConfig>) => {
                        const current = [
                          ...(draft.deliveryMethods || DEFAULT_SITE_SETTINGS.deliveryMethods || []),
                        ];
                        current[idx] = { ...current[idx], ...updates };
                        updateField('deliveryMethods', current);
                      };

                      return (
                        <div
                          key={method.id || idx}
                          className={`rounded-2xl border p-4 transition-all ${
                            method.enabled
                              ? 'border-black/10 dark:border-white/10 bg-white dark:bg-ink-800'
                              : 'opacity-65 bg-black/5 dark:bg-white/5 border-dashed'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-3">
                            <span className="text-xs font-mono font-bold uppercase text-gold-500">
                              {method.id.toUpperCase()}
                            </span>

                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <span className="text-xs font-bold text-ink-600 dark:text-ink-300">
                                {method.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <input
                                type="checkbox"
                                checked={method.enabled}
                                onChange={(e) => updateMethod({ enabled: e.target.checked })}
                                className="h-4 w-4 rounded accent-gold-500"
                              />
                            </label>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-ink-400 mb-1">
                                Method Title
                              </label>
                              <input
                                type="text"
                                value={method.title}
                                onChange={(e) => updateMethod({ title: e.target.value })}
                                className="input-lux text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-ink-400 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={method.description}
                                onChange={(e) => updateMethod({ description: e.target.value })}
                                className="input-lux text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-ink-400 mb-1">
                                  Estimated Time
                                </label>
                                <input
                                  type="text"
                                  value={method.estimatedTime}
                                  onChange={(e) => updateMethod({ estimatedTime: e.target.value })}
                                  className="input-lux text-xs font-medium"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-ink-400 mb-1">
                                  Default Rate (৳)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={method.defaultCharge}
                                  onChange={(e) => updateMethod({ defaultCharge: Number(e.target.value) })}
                                  className="input-lux text-xs font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. FREE SHIPPING RULES & ANNOUNCEMENT */}
                <div className="card-lux p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-gold-500" />
                        Free Shipping Rules & Announcement Banner
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        Incentivize higher order values with automatic free shipping thresholds.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-bold text-ink-700 dark:text-ink-200">
                        {draft.freeShippingEnabled !== false ? 'Active' : 'Disabled'}
                      </span>
                      <input
                        type="checkbox"
                        checked={draft.freeShippingEnabled !== false}
                        onChange={(e) => updateField('freeShippingEnabled', e.target.value === 'true' || e.target.checked)}
                        className="h-5 w-5 rounded accent-gold-500"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Minimum Qualifying Order Amount (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={draft.freeShippingThreshold ?? 3000}
                        onChange={(e) => updateField('freeShippingThreshold', Math.max(0, Number(e.target.value)))}
                        className="input-lux font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Free Shipping Announcement Message
                      </label>
                      <input
                        type="text"
                        value={
                          draft.freeShippingMessage ||
                          draft.deliveryFreeShippingText ||
                          'Congratulations! Your order qualifies for FREE Delivery.'
                        }
                        onChange={(e) => {
                          updateField('freeShippingMessage', e.target.value);
                          updateField('deliveryFreeShippingText', e.target.value);
                        }}
                        className="input-lux font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. LOCAL SHOWROOM PICKUP DETAILS */}
                <div className="card-lux p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                        <Building2 size={18} className="text-gold-500" />
                        Local Showroom Pickup Details
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        Allow customers to pick up orders directly from your flagship store.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-bold text-ink-700 dark:text-ink-200">
                        {draft.localPickupEnabled !== false ? 'Enabled' : 'Disabled'}
                      </span>
                      <input
                        type="checkbox"
                        checked={draft.localPickupEnabled !== false}
                        onChange={(e) => updateField('localPickupEnabled', e.target.checked)}
                        className="h-5 w-5 rounded accent-gold-500"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Showroom / Pickup Address
                      </label>
                      <input
                        type="text"
                        value={draft.localPickupAddress || 'House 14, Road 11, Block D, Banani, Dhaka-1213'}
                        onChange={(e) => updateField('localPickupAddress', e.target.value)}
                        className="input-lux font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Business / Collection Hours
                      </label>
                      <input
                        type="text"
                        value={draft.localPickupBusinessHours || 'Mon – Sat: 10:00 AM – 8:30 PM'}
                        onChange={(e) => updateField('localPickupBusinessHours', e.target.value)}
                        className="input-lux font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Showroom Contact Phone
                      </label>
                      <input
                        type="text"
                        value={draft.localPickupContactNumber || '+880 1700-000000'}
                        onChange={(e) => updateField('localPickupContactNumber', e.target.value)}
                        className="input-lux font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                        Customer Pickup Instructions
                      </label>
                      <input
                        type="text"
                        value={
                          draft.localPickupInstructions ||
                          'Please show your order confirmation SMS or email upon arrival.'
                        }
                        onChange={(e) => updateField('localPickupInstructions', e.target.value)}
                        className="input-lux font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. ADMIN LIVE SHIPPING COST SIMULATOR & PREVIEW */}
                <div className="card-lux p-5 border-gold-400/30 bg-gradient-to-b from-white via-white to-gold-400/5 dark:from-ink-900 dark:via-ink-900 dark:to-gold-400/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                        <Calculator size={18} className="text-gold-500" />
                        Admin Live Shipping Calculator & Customer Preview
                      </h4>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        Test your current rules live. Simulates checkout calculations based on order subtotal and customer destination.
                      </p>
                    </div>

                    <span className="rounded-md bg-gold-400/15 px-2.5 py-1 text-[11px] font-bold text-gold-600 dark:text-gold-400 uppercase">
                      Live Simulation
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Simulator Inputs */}
                    <div className="space-y-3 md:col-span-1">
                      <div>
                        <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                          Test Order Subtotal (৳)
                        </label>
                        <input
                          type="number"
                          value={previewSubtotal}
                          onChange={(e) => setPreviewSubtotal(Number(e.target.value))}
                          className="input-lux text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                          Test Customer District
                        </label>
                        <select
                          value={previewDistrict}
                          onChange={(e) => setPreviewDistrict(e.target.value)}
                          className="input-lux text-xs font-semibold"
                        >
                          <option value="Dhaka">Dhaka (Inside Met)</option>
                          <option value="Gazipur">Gazipur (Suburbs)</option>
                          <option value="Chittagong">Chittagong (Outside Dhaka)</option>
                          <option value="Sylhet">Sylhet (Outside Dhaka)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                          Delivery Method
                        </label>
                        <select
                          value={previewMethod}
                          onChange={(e) => setPreviewMethod(e.target.value)}
                          className="input-lux text-xs font-semibold"
                        >
                          <option value="std">Standard Delivery</option>
                          <option value="exp">Express Priority</option>
                          <option value="pickup">Showroom Pickup</option>
                        </select>
                      </div>
                    </div>

                    {/* Simulator Output Preview Card */}
                    <div className="md:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-800 p-4 space-y-3 shadow-sm">
                      <div className="text-xs font-bold uppercase tracking-wider text-ink-400 border-b border-black/5 dark:border-white/5 pb-2">
                        Checkout Shipping Breakdown Preview
                      </div>

                      {(() => {
                        const threshold = draft.freeShippingThreshold ?? 3000;
                        const isFree =
                          draft.freeShippingEnabled !== false && previewSubtotal >= threshold;

                        // Find matching zone
                        const zones =
                          draft.deliveryZones || DEFAULT_SITE_SETTINGS.deliveryZones || [];
                        const matchedZone = zones.find(
                          (z) => z.enabled && z.districts.some((d) => d.toLowerCase().includes(previewDistrict.toLowerCase()))
                        );

                        let computedFee = matchedZone ? matchedZone.charge : draft.defaultShippingFee ?? 120;
                        if (previewMethod === 'pickup') computedFee = 0;
                        if (previewMethod === 'exp') computedFee = Math.max(computedFee, 250);
                        if (isFree && previewMethod === 'std') computedFee = 0;

                        const estTime = previewMethod === 'pickup'
                          ? 'Ready in 2 Hours'
                          : previewMethod === 'exp'
                          ? '1–2 Days'
                          : matchedZone
                          ? matchedZone.estimatedDelivery
                          : draft.deliveryTime || '2–4 Business Days';

                        return (
                          <div className="space-y-3">
                            {isFree ? (
                              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                                <Sparkles size={16} />
                                {draft.freeShippingMessage || 'Congratulations! Your order qualifies for FREE Delivery.'}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-ink-500">
                                  <span>Progress to Free Shipping</span>
                                  <span>
                                    ৳{previewSubtotal} / ৳{threshold}
                                  </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-gold-400 transition-all"
                                    style={{
                                      width: `${Math.min(100, (previewSubtotal / threshold) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-[11px] text-ink-400">
                                  Add ৳{Math.max(0, threshold - previewSubtotal)} more for free shipping.
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-black/5 dark:border-white/5">
                              <div>
                                <span className="text-ink-400 block text-[10px] uppercase font-semibold">Matched Zone</span>
                                <span className="font-bold text-ink-900 dark:text-white">
                                  {matchedZone ? matchedZone.name : 'Default Fallback'}
                                </span>
                              </div>

                              <div>
                                <span className="text-ink-400 block text-[10px] uppercase font-semibold">Estimated Time</span>
                                <span className="font-bold text-ink-900 dark:text-white">{estTime}</span>
                              </div>

                              <div>
                                <span className="text-ink-400 block text-[10px] uppercase font-semibold">Shipping Charge</span>
                                <span className="font-extrabold text-gold-600 dark:text-gold-400 text-sm">
                                  {computedFee === 0 ? 'FREE' : `৳${computedFee}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
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
              <HomepageBuilder />
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

                  <label className="flex items-center gap-3 cursor-pointer select-none border border-black/5 dark:border-white/10 rounded-xl p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <input
                      type="checkbox"
                      checked={draft.flagEnableSizePredictor !== false}
                      onChange={(e) => updateField('flagEnableSizePredictor', e.target.checked)}
                      className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                    />
                    <div>
                      <div className="text-sm font-semibold">Enable Smart Size Predictor</div>
                      <div className="text-[10px] text-ink-400">Predictor modal on product pages</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 11: PAYMENT GATEWAYS */}
            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Summary Card */}
                <div className="card-lux p-5 bg-gradient-to-r from-ink-900 to-ink-950 text-white border-gold-400/20">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/20 text-gold-400">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">Payment Methods Configuration</h3>
                        <p className="text-xs text-ink-300">
                          Configure checkout options including Cash on Delivery, Mobile Wallets (bKash, Nagad, Rocket), and International Credit Card Gateways.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>
                        {(draft.paymentGateways || DEFAULT_SITE_SETTINGS.paymentGateways || []).filter((g) => g.enabled).length} Active Gateways
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gateways List */}
                <div className="space-y-4">
                  {(draft.paymentGateways || DEFAULT_SITE_SETTINGS.paymentGateways || [])
                    .slice()
                    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    .map((gw, idx) => {
                      const actualIdx = (draft.paymentGateways || DEFAULT_SITE_SETTINGS.paymentGateways || []).findIndex(
                        (item) => item.id === gw.id
                      );
                      const targetIdx = actualIdx >= 0 ? actualIdx : idx;

                      const updateGw = (updates: Partial<PaymentGatewayConfig>) => {
                        const current = [
                          ...(draft.paymentGateways || DEFAULT_SITE_SETTINGS.paymentGateways || []),
                        ];
                        current[targetIdx] = { ...current[targetIdx], ...updates };
                        updateField('paymentGateways', current);
                      };

                      return (
                        <div
                          key={gw.id}
                          className={`card-lux p-5 transition-all ${
                            gw.enabled
                              ? 'border-gold-400/30 bg-white dark:bg-ink-900'
                              : 'opacity-75 bg-black/5 dark:bg-white/5'
                          }`}
                        >
                          {/* Card Top Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/5 dark:bg-white/10">
                                {gw.iconName === 'Banknote' ? (
                                  <Banknote size={20} className="text-emerald-500" />
                                ) : gw.iconName === 'Smartphone' ? (
                                  <Smartphone size={20} className="text-pink-500" />
                                ) : gw.iconName === 'Globe' ? (
                                  <Globe size={20} className="text-blue-500" />
                                ) : (
                                  <CreditCard size={20} className="text-amber-500" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display text-base font-bold text-ink-900 dark:text-white">
                                    {gw.name}
                                  </h4>
                                  <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-ink-500 dark:text-ink-300">
                                    {gw.id.toUpperCase()}
                                  </span>
                                  {gw.isFutureIntegration && (
                                    <span className="rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                                      Future Integration
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-ink-500 dark:text-ink-400">{gw.description}</p>
                              </div>
                            </div>

                            {/* Enable Toggle Switch */}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <span className="text-xs font-bold text-ink-600 dark:text-ink-300">
                                {gw.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <input
                                type="checkbox"
                                checked={gw.enabled}
                                onChange={(e) => updateGw({ enabled: e.target.checked })}
                                className="h-5 w-5 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                              />
                            </label>
                          </div>

                          {/* Card Detailed Inputs */}
                          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                                Display Name
                              </label>
                              <input
                                type="text"
                                value={gw.name}
                                onChange={(e) => updateGw({ name: e.target.value })}
                                className="input-lux text-xs font-medium"
                                placeholder="Gateway Name"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                                Short Description
                              </label>
                              <input
                                type="text"
                                value={gw.description}
                                onChange={(e) => updateGw({ description: e.target.value })}
                                className="input-lux text-xs font-medium"
                                placeholder="Brief summary"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                                Sort Order
                              </label>
                              <input
                                type="number"
                                value={gw.sortOrder || 1}
                                onChange={(e) => updateGw({ sortOrder: Number(e.target.value) })}
                                className="input-lux text-xs font-medium"
                                placeholder="Position order"
                              />
                            </div>

                            {(gw.id === 'bkash' || gw.id === 'nagad' || gw.id === 'rocket') && (
                              <div>
                                <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                                  Merchant Number / Biller ID
                                </label>
                                <input
                                  type="text"
                                  value={gw.merchantNumber || ''}
                                  onChange={(e) => updateGw({ merchantNumber: e.target.value })}
                                  className="input-lux text-xs font-mono font-medium"
                                  placeholder="e.g. 01700000000"
                                />
                              </div>
                            )}

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">
                                Instructions / Note for Customer
                              </label>
                              <input
                                type="text"
                                value={gw.instructions || ''}
                                onChange={(e) => updateGw({ instructions: e.target.value })}
                                className="input-lux text-xs font-medium"
                                placeholder="Customer payment guidance"
                              />
                            </div>

                            {!gw.isFutureIntegration && gw.id !== 'cod' && (
                              <div className="flex items-center pt-5">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink-600 dark:text-ink-300">
                                  <input
                                    type="checkbox"
                                    checked={gw.sandboxMode ?? true}
                                    onChange={(e) => updateGw({ sandboxMode: e.target.checked })}
                                    className="h-4 w-4 rounded border-black/10 text-gold-500 focus:ring-gold-500/30"
                                  />
                                  <span>Enable Test / Sandbox Mode</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          {activeTab !== 'homepage' && (
            <div className="flex justify-end gap-3 border-t border-black/5 dark:border-white/10 pt-6">
              <button
                type="button"
                onClick={handleSave}
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
          )}
        </main>
      </div>
    </div>
  );
}
