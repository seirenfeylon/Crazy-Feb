import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../store';
import { useAuth } from '../../../lib/authContext';
import {
  HomepageBuilderConfig,
  HomepageSectionConfig,
  HomepageSectionType,
  HomepageBuilderVersionSnapshot
} from '../../../types';
import { migrateHomepageConfig } from '../../../lib/homepageRegistry';
import { SectionManagerCard } from './SectionManagerCard';
import { HeroBannerEditor } from './HeroBannerEditor';
import { FeaturedProductsEditor } from './FeaturedProductsEditor';
import { FeaturedCategoriesEditor } from './FeaturedCategoriesEditor';
import { FlashSaleEditor } from './FlashSaleEditor';
import { CollectionSectionEditor } from './CollectionSectionEditor';
import { BrandStoryEditor } from './BrandStoryEditor';
import { TestimonialsEditor } from './TestimonialsEditor';
import { InstagramFeedEditor } from './InstagramFeedEditor';
import { NewsletterEditor } from './NewsletterEditor';
import { GlobalSectionSettingsEditor } from './GlobalSectionSettingsEditor';
import { SEOEditor } from './SEOEditor';
import { VersionHistoryModal } from './VersionHistoryModal';
import { BuilderLockBanner } from './BuilderLockBanner';
import { HomepageRenderer } from '../../homepage/HomepageRenderer';
import {
  Plus,
  Save,
  Send,
  RotateCcw,
  History,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Globe,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const HomepageBuilder: React.FC = () => {
  const { siteSettings, updateSiteSettings, toast } = useStore();
  const { user } = useAuth();

  // Load and migrate current published and draft configurations
  const liveConfig = useMemo(() => migrateHomepageConfig(siteSettings), [siteSettings]);
  
  // Local draft state
  const [draftConfig, setDraftConfig] = useState<HomepageBuilderConfig>(() => {
    return siteSettings.homepageBuilderDraft || liveConfig;
  });

  // Track if unsaved changes exist
  const [isDirty, setIsDirty] = useState(false);

  // Selected section ID for editing
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(() => {
    return draftConfig.sections[0]?.id || null;
  });

  // Active view tab: 'sections' | 'seo'
  const [activeTab, setActiveTab] = useState<'sections' | 'seo'>('sections');

  // Preview device frame mode: 'desktop' | 'tablet' | 'mobile'
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Version history modal open
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Warning for unsaved changes before leaving browser window
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes in Homepage Builder. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle section selection
  const selectedSection = useMemo(() => {
    return draftConfig.sections.find((s) => s.id === selectedSectionId) || draftConfig.sections[0] || null;
  }, [draftConfig.sections, selectedSectionId]);

  // Update a specific section in draft state
  const handleUpdateSection = (updatedSection: HomepageSectionConfig) => {
    const updatedSections = draftConfig.sections.map((s) =>
      s.id === updatedSection.id ? updatedSection : s
    );
    setDraftConfig((prev) => ({
      ...prev,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    }));
    setIsDirty(true);
  };

  // Reorder sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draftConfig.sections.length) return;

    const newSections = [...draftConfig.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Re-index display orders
    const reordered = newSections.map((s, idx) => ({ ...s, displayOrder: idx + 1 }));

    setDraftConfig((prev) => ({ ...prev, sections: reordered }));
    setIsDirty(true);
  };

  // Toggle section enabled
  const handleToggleEnabled = (sectionId: string) => {
    const updatedSections = draftConfig.sections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    setDraftConfig((prev) => ({ ...prev, sections: updatedSections }));
    setIsDirty(true);
  };

  // Add new section modal/dropdown
  const handleAddSection = (type: HomepageSectionType) => {
    const newId = `${type}-${Date.now()}`;
    const newSection: HomepageSectionConfig = {
      id: newId,
      type,
      name: type.replace('_', ' ').toUpperCase(),
      enabled: true,
      displayOrder: draftConfig.sections.length + 1,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true,
        animationEnabled: true
      },
      heroBannerConfig: type === 'hero_banner' ? { slides: [], autoRotate: true, rotationInterval: 6 } : undefined,
      featuredProductsConfig: type.includes('products') || type === 'new_arrivals' || type === 'best_sellers'
        ? { sourceType: 'automatic_newest', maxProducts: 8, desktopColumns: 4, mobileColumns: 2 }
        : undefined
    };

    setDraftConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSectionId(newId);
    setIsDirty(true);
  };

  // Save Draft to Firestore
  const handleSaveDraft = async () => {
    try {
      await updateSiteSettings({
        homepageBuilderDraft: {
          ...draftConfig,
          updatedAt: new Date().toISOString()
        }
      });
      setIsDirty(false);
      toast('Draft saved successfully');
    } catch {
      toast('Failed to save draft');
    }
  };

  // Publish Draft Live
  const handlePublishLive = async () => {
    try {
      // 1. Create a snapshot before publishing
      const newSnapshot: HomepageBuilderVersionSnapshot = {
        id: `version-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.displayName || 'Admin',
        adminEmail: user?.email || '',
        note: 'Published new live layout',
        sections: draftConfig.sections,
        seo: draftConfig.seo
      };

      // 2. Limit snapshots to latest 20
      const currentVersions = siteSettings.homepageBuilderVersions || [];
      const updatedVersions = [newSnapshot, ...currentVersions].slice(0, 20);

      // 3. Update Firestore site settings
      const publishedConfig: HomepageBuilderConfig = {
        ...draftConfig,
        version: (draftConfig.version || 1) + 1,
        lastPublishedAt: new Date().toISOString(),
        lastPublishedBy: user?.email || 'Admin'
      };

      await updateSiteSettings({
        homepageBuilder: publishedConfig,
        homepageBuilderDraft: publishedConfig,
        homepageBuilderVersions: updatedVersions
      });

      setDraftConfig(publishedConfig);
      setIsDirty(false);
      toast('Homepage published live successfully!');
    } catch {
      toast('Failed to publish homepage live');
    }
  };

  // Discard Draft Changes
  const handleDiscardChanges = () => {
    if (confirm('Discard all unsaved draft changes and reset to live published homepage?')) {
      setDraftConfig(liveConfig);
      setIsDirty(false);
      toast('Reset to live published homepage');
    }
  };

  // Restore snapshot version
  const handleRestoreVersion = async (snapshot: HomepageBuilderVersionSnapshot) => {
    // Auto-backup current state before rollback
    const backupSnapshot: HomepageBuilderVersionSnapshot = {
      id: `backup-pre-rollback-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: user?.displayName || 'Admin',
      adminEmail: user?.email || '',
      note: `Auto backup before rollback to ${snapshot.timestamp}`,
      sections: draftConfig.sections,
      seo: draftConfig.seo
    };

    const currentVersions = siteSettings.homepageBuilderVersions || [];
    const updatedVersions = [backupSnapshot, ...currentVersions].slice(0, 20);

    const restoredConfig: HomepageBuilderConfig = {
      version: (draftConfig.version || 1) + 1,
      sections: snapshot.sections,
      seo: snapshot.seo,
      updatedAt: new Date().toISOString()
    };

    setDraftConfig(restoredConfig);
    setIsDirty(true);

    await updateSiteSettings({
      homepageBuilderVersions: updatedVersions
    });

    toast('Restored snapshot to draft! Click Publish to apply live.');
  };

  // Acquire Lock
  const handleAcquireLock = async () => {
    const lock = {
      lockedBy: user?.email || 'admin@crazyfeb.com',
      lockedByName: user?.displayName || 'Admin',
      lockedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
    await updateSiteSettings({ homepageBuilderLock: lock });
    toast('Acquired editing lock');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Lock Banner */}
      <BuilderLockBanner
        lock={siteSettings.homepageBuilderLock}
        currentAdminEmail={user?.email || ''}
        onAcquireLock={handleAcquireLock}
      />

      {/* Top Header Bar */}
      <div className="bg-white dark:bg-ink-800 p-4 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gold-500/10 text-gold-500 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
                Homepage Builder
              </h2>
              {isDirty ? (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500/20 text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Unsaved Draft
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Synced
                </span>
              )}
            </div>
            <p className="text-xs text-ink-500 dark:text-ink-300">
              Drag, edit, configure, and publish your homepage sections live without code.
            </p>
          </div>
        </div>

        {/* Master Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-black/5 dark:bg-white/10 text-ink-700 dark:text-ink-200 hover:bg-black/10 dark:hover:bg-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-gold-500" /> History Snapshots
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Discard
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!isDirty}
            className="px-3 py-2 bg-ink-900 dark:bg-white text-white dark:text-black hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black rounded-xl text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublishLive}
            className="px-4 py-2 bg-gold-500 text-black hover:bg-gold-400 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-gold-500/20"
          >
            <Send className="w-4 h-4" /> Publish Live
          </button>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Manager List */}
        <div className="lg:col-span-4 bg-white dark:bg-ink-800 rounded-2xl border border-black/10 dark:border-white/10 p-4 space-y-4 shadow-sm">
          {/* Navigation Tabs */}
          <div className="flex p-1 bg-ink-50 dark:bg-ink-900/60 rounded-xl border border-black/5 dark:border-white/10 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'sections'
                  ? 'bg-white dark:bg-ink-800 text-ink-900 dark:text-white font-semibold shadow-sm'
                  : 'text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Sections ({draftConfig.sections.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'seo'
                  ? 'bg-white dark:bg-ink-800 text-ink-900 dark:text-white font-semibold shadow-sm'
                  : 'text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> SEO & Social
            </button>
          </div>

          {activeTab === 'sections' ? (
            <>
              {/* Add New Section Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="w-full py-2.5 px-3 bg-gold-500/10 hover:bg-gold-500/20 text-gold-500 rounded-xl font-semibold text-xs border border-gold-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add New Homepage Section
                </button>
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-ink-900 rounded-xl border border-black/10 dark:border-white/10 shadow-xl p-2 hidden group-hover:block z-30 space-y-1">
                  {[
                    { type: 'hero_banner', label: 'Hero Banner Slider' },
                    { type: 'featured_categories', label: 'Featured Categories' },
                    { type: 'new_arrivals', label: 'New Arrivals Product Row' },
                    { type: 'best_sellers', label: 'Best Sellers Product Row' },
                    { type: 'flash_sale', label: 'Flash Sale Countdown' },
                    { type: 'collections', label: 'Seasonal Collections' },
                    { type: 'brand_story', label: 'Brand Story & Heritage' },
                    { type: 'testimonials', label: 'Client Testimonials' },
                    { type: 'instagram_feed', label: 'Instagram Social Feed' },
                    { type: 'newsletter', label: 'Newsletter Capture' }
                  ].map((sec) => (
                    <button
                      key={sec.type}
                      type="button"
                      onClick={() => handleAddSection(sec.type as any)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-gold-500/10 hover:text-gold-500 transition"
                    >
                      + {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Draggable Section List */}
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {draftConfig.sections.map((sec, idx) => (
                  <SectionManagerCard
                    key={sec.id}
                    section={sec}
                    index={idx}
                    totalSections={draftConfig.sections.length}
                    isSelected={selectedSectionId === sec.id}
                    onSelect={() => setSelectedSectionId(sec.id)}
                    onToggleEnabled={() => handleToggleEnabled(sec.id)}
                    onMoveUp={() => handleMoveSection(idx, 'up')}
                    onMoveDown={() => handleMoveSection(idx, 'down')}
                  />
                ))}
              </div>
            </>
          ) : (
            <SEOEditor
              seo={draftConfig.seo}
              onChange={(updatedSeo) => {
                setDraftConfig((prev) => ({ ...prev, seo: updatedSeo }));
                setIsDirty(true);
              }}
            />
          )}
        </div>

        {/* Center Column: Section Configuration Editor */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'sections' && selectedSection ? (
            <div className="bg-white dark:bg-ink-800 rounded-2xl border border-black/10 dark:border-white/10 p-6 shadow-sm space-y-6">
              {/* Active Section Header */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                    Editing: {selectedSection.name || selectedSection.type}
                  </h3>
                  <span className="text-xs text-gold-500 font-mono uppercase tracking-wider">
                    ID: {selectedSection.id}
                  </span>
                </div>
              </div>

              {/* Specific Section Type Editor */}
              {renderSpecificSectionEditor(selectedSection, handleUpdateSection)}

              {/* Global Styles & Container Settings */}
              <GlobalSectionSettingsEditor
                sectionName={selectedSection.name}
                onNameChange={(newName) => handleUpdateSection({ ...selectedSection, name: newName })}
                styles={selectedSection.styles || {}}
                onChange={(updatedStyles) => handleUpdateSection({ ...selectedSection, styles: updatedStyles })}
              />
            </div>
          ) : activeTab === 'sections' ? (
            <div className="bg-white dark:bg-ink-800 rounded-2xl border border-black/10 dark:border-white/10 p-12 text-center text-ink-400">
              Select a section from the left column to begin editing its configuration.
            </div>
          ) : null}

          {/* Bottom Live Interactive Preview Bar */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl border border-black/10 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold-500" />
                <h3 className="font-semibold text-base text-ink-900 dark:text-white">
                  Live Responsive Preview Frame
                </h3>
              </div>

              {/* Device switcher buttons */}
              <div className="flex items-center bg-ink-50 dark:bg-ink-900 p-1 rounded-xl border border-black/5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setDeviceFrame('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                    deviceFrame === 'desktop' ? 'bg-gold-500 text-black font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceFrame('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                    deviceFrame === 'tablet' ? 'bg-gold-500 text-black font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-4 h-4" /> Tablet
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceFrame('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                    deviceFrame === 'mobile' ? 'bg-gold-500 text-black font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>
            </div>

            {/* Preview Frame Wrapper */}
            <div className="p-4 bg-ink-950 rounded-xl border border-white/10 overflow-x-auto flex justify-center">
              <div
                className={`bg-ink-900 transition-all duration-300 overflow-y-auto rounded-lg border border-white/10 max-h-[700px] shadow-2xl ${
                  deviceFrame === 'desktop'
                    ? 'w-full'
                    : deviceFrame === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                <HomepageRenderer
                  sections={draftConfig.sections}
                  siteSettings={siteSettings}
                  isAdminPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        versions={siteSettings.homepageBuilderVersions}
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  );
};

// Render specific editor based on section type
function renderSpecificSectionEditor(
  section: HomepageSectionConfig,
  onUpdate: (updated: HomepageSectionConfig) => void
) {
  switch (section.type) {
    case 'hero_banner':
      return (
        <HeroBannerEditor
          config={section.heroBannerConfig || { slides: [] }}
          onChange={(heroBannerConfig) => onUpdate({ ...section, heroBannerConfig })}
        />
      );

    case 'featured_products':
    case 'new_arrivals':
    case 'best_sellers':
      return (
        <FeaturedProductsEditor
          config={section.featuredProductsConfig || { sourceType: 'automatic_newest', maxProducts: 8, desktopColumns: 4, mobileColumns: 2 }}
          onChange={(featuredProductsConfig) => onUpdate({ ...section, featuredProductsConfig })}
        />
      );

    case 'featured_categories':
      return (
        <FeaturedCategoriesEditor
          config={section.featuredCategoriesConfig || { categoryIds: ['women', 'men', 'bags', 'shoes', 'accessories'] }}
          onChange={(featuredCategoriesConfig) => onUpdate({ ...section, featuredCategoriesConfig })}
        />
      );

    case 'flash_sale':
      return (
        <FlashSaleEditor
          config={section.flashSaleConfig || { enabled: true, title: 'Flash Sale', productIds: [] }}
          onChange={(flashSaleConfig) => onUpdate({ ...section, flashSaleConfig })}
        />
      );

    case 'collections':
      return (
        <CollectionSectionEditor
          config={section.collectionsConfig || { collections: [] }}
          onChange={(collectionsConfig) => onUpdate({ ...section, collectionsConfig })}
        />
      );

    case 'brand_story':
      return (
        <BrandStoryEditor
          config={section.brandStoryConfig || { title: '', description: '' }}
          onChange={(brandStoryConfig) => onUpdate({ ...section, brandStoryConfig })}
        />
      );

    case 'testimonials':
      return (
        <TestimonialsEditor
          config={section.testimonialsConfig || { items: [] }}
          onChange={(testimonialsConfig) => onUpdate({ ...section, testimonialsConfig })}
        />
      );

    case 'instagram_feed':
      return (
        <InstagramFeedEditor
          config={section.instagramFeedConfig || { enabled: true, numberOfPosts: 6, gridLayout: '6-col' }}
          onChange={(instagramFeedConfig) => onUpdate({ ...section, instagramFeedConfig })}
        />
      );

    case 'newsletter':
      return (
        <NewsletterEditor
          config={section.newsletterConfig || { enabled: true, title: 'Subscribe' }}
          onChange={(newsletterConfig) => onUpdate({ ...section, newsletterConfig })}
        />
      );

    default:
      return null;
  }
}
