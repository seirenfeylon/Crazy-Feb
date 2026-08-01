import React, { useMemo } from 'react';
import { HomepageSectionConfig, SiteSettings } from '../../types';
import { HomepageSectionErrorBoundary } from './HomepageSectionErrorBoundary';
import {
  FeaturedCollections,
  FlashSale,
  InstagramFeed,
  LimitedEditionBanner,
  Newsletter,
  PremiumCategories,
  ProductRow,
  CustomerReviews
} from '../HomeSections';
import { HeroBannerSection } from './HeroBannerSection';

interface HomepageRendererProps {
  sections?: HomepageSectionConfig[];
  siteSettings: SiteSettings;
  isAdminPreview?: boolean;
}

export const HomepageRenderer: React.FC<HomepageRendererProps> = ({
  sections,
  siteSettings,
  isAdminPreview = false
}) => {
  // Sort and filter enabled sections
  const activeSections = useMemo(() => {
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return null;
    }

    return [...sections]
      .filter((s) => s.enabled !== false)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [sections]);

  if (!activeSections || activeSections.length === 0) {
    // Legacy fallback rendering if homepageBuilder is not configured or empty
    return (
      <main className="w-full overflow-x-hidden">
        <HeroBannerSection />
        <FeaturedCollections />
        <ProductRow
          id="new-arrivals"
          eyebrow="Just landed"
          title={siteSettings.newArrivalTitle || 'New Arrivals'}
          subtitle="Fresh arrivals for the season."
          filter={(p) => p.tags.includes('new')}
          cta={{ label: 'View all', route: { name: 'new-arrivals' } }}
        />
        <FlashSale />
        <ProductRow
          id="best-sellers"
          eyebrow="Most coveted"
          title={siteSettings.bestSellerTitle || 'Best Sellers'}
          subtitle="Our most loved pieces."
          filter={(p) => p.tags.includes('bestseller')}
          cta={{ label: 'Shop best sellers', route: { name: 'shop' } }}
        />
        <PremiumCategories />
        <CustomerReviews />
        <InstagramFeed />
        <Newsletter />
      </main>
    );
  }

  return (
    <main className="w-full overflow-x-hidden">
      {activeSections.map((section) => {
        const { id, type, name, styles, heroBannerConfig, featuredProductsConfig, flashSaleConfig, collectionsConfig, brandStoryConfig, testimonialsConfig, instagramFeedConfig, newsletterConfig } = section;

        // Container Width Classes
        let containerClass = 'container-lux';
        if (styles?.containerWidth === 'narrow') {
          containerClass = 'max-w-4xl mx-auto px-4 sm:px-6';
        } else if (styles?.containerWidth === 'wide') {
          containerClass = 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8';
        } else if (styles?.containerWidth === 'full') {
          containerClass = 'w-full';
        }

        // Inline container styles
        const sectionStyle: React.CSSProperties = {
          paddingTop: styles?.paddingTop !== undefined ? `${styles.paddingTop}px` : undefined,
          paddingBottom: styles?.paddingBottom !== undefined ? `${styles.paddingBottom}px` : undefined,
          backgroundColor: styles?.backgroundColor || undefined,
          backgroundImage: styles?.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
          borderRadius: styles?.borderRadius ? `${styles.borderRadius}px` : undefined,
          backgroundSize: styles?.backgroundImage ? 'cover' : undefined,
          backgroundPosition: styles?.backgroundImage ? 'center' : undefined,
        };

        // Device Visibility classes
        let visibilityClass = '';
        if (styles?.desktopVisible === false) visibilityClass += ' lg:hidden';
        if (styles?.tabletVisible === false) visibilityClass += ' md:max-lg:hidden';
        if (styles?.mobileVisible === false) visibilityClass += ' max-md:hidden';

        return (
          <HomepageSectionErrorBoundary
            key={id || type}
            sectionId={id}
            sectionName={name}
            isAdminPreview={isAdminPreview}
          >
            <div
              id={id}
              style={sectionStyle}
              className={`relative transition-all duration-300 ${visibilityClass}`}
            >
              <React.Suspense fallback={<div className="h-24 flex items-center justify-center text-sm text-ink-400">Loading section...</div>}>
                {renderSectionContent(type, {
                  heroBannerConfig,
                  featuredProductsConfig,
                  flashSaleConfig,
                  collectionsConfig,
                  brandStoryConfig,
                  testimonialsConfig,
                  instagramFeedConfig,
                  newsletterConfig,
                  siteSettings,
                  containerClass
                })}
              </React.Suspense>
            </div>
          </HomepageSectionErrorBoundary>
        );
      })}
    </main>
  );
};

// Helper renderer for each section type
function renderSectionContent(type: string, props: any) {
  switch (type) {
    case 'hero_banner':
      return <HeroBannerSection config={props.heroBannerConfig} />;

    case 'featured_categories':
      return <PremiumCategories config={props.featuredCategoriesConfig} />;

    case 'new_arrivals':
      return (
        <ProductRow
          id="new-arrivals"
          eyebrow="Just landed"
          title={props.featuredProductsConfig?.title || 'New Arrivals'}
          subtitle={props.featuredProductsConfig?.subtitle || 'Fresh arrivals for the season.'}
          filter={(p) => p.tags.includes('new')}
          limit={props.featuredProductsConfig?.maxProducts || 8}
          cta={{ label: 'View all', route: { name: 'new-arrivals' } }}
        />
      );

    case 'best_sellers':
      return (
        <ProductRow
          id="best-sellers"
          eyebrow="Most coveted"
          title={props.featuredProductsConfig?.title || 'Best Sellers'}
          subtitle={props.featuredProductsConfig?.subtitle || 'Our most loved pieces.'}
          filter={(p) => p.tags.includes('bestseller')}
          limit={props.featuredProductsConfig?.maxProducts || 8}
          cta={{ label: 'Shop best sellers', route: { name: 'shop' } }}
        />
      );

    case 'featured_products': {
      const config = props.featuredProductsConfig;
      const filterFn = (p: any) => {
        if (config?.sourceType === 'manual' && config.manualProductIds?.length) {
          return config.manualProductIds.includes(p.id);
        }
        if (config?.sourceType === 'automatic_rated') return p.rating >= 4.5;
        if (config?.sourceType === 'automatic_views') return p.reviewCount > 10;
        if (config?.sourceType === 'automatic_bestseller') return p.tags.includes('bestseller');
        return true;
      };

      return (
        <ProductRow
          id="featured-products"
          eyebrow="Curated Selection"
          title={config?.title || 'Featured Products'}
          subtitle={config?.subtitle || 'Handpicked for the discerning collector'}
          filter={filterFn}
          limit={config?.maxProducts || 8}
          cta={{ label: 'Explore catalog', route: { name: 'shop' } }}
        />
      );
    }

    case 'flash_sale':
      return <FlashSale config={props.flashSaleConfig} />;

    case 'collections':
      return <FeaturedCollections config={props.collectionsConfig} />;

    case 'brand_story':
      return <LimitedEditionBanner config={props.brandStoryConfig} />;

    case 'testimonials':
      return <CustomerReviews config={props.testimonialsConfig} />;

    case 'instagram_feed':
      return <InstagramFeed config={props.instagramFeedConfig} />;

    case 'newsletter':
      return <Newsletter config={props.newsletterConfig} />;

    case 'footer_cta':
      return <LimitedEditionBanner config={props.brandStoryConfig} />;

    default:
      return null;
  }
}
