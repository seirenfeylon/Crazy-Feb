import React from 'react';
import {
  HomepageBuilderConfig,
  HomepageSectionConfig,
  HomepageSectionType,
  SiteSettings
} from '../types';

export interface SectionRegistryEntry {
  type: HomepageSectionType;
  name: string;
  defaultTitle: string;
  component: React.ComponentType<any>;
}

// Global Registry Object
const SECTION_REGISTRY: Map<string, SectionRegistryEntry> = new Map();

/**
 * Register a homepage section component
 */
export function registerSection(entry: SectionRegistryEntry): void {
  SECTION_REGISTRY.set(entry.type, entry);
}

/**
 * Get registered section details by type
 */
export function getSectionRegistryEntry(type: string): SectionRegistryEntry | undefined {
  return SECTION_REGISTRY.get(type);
}

/**
 * Get list of all registered sections
 */
export function getAllRegisteredSections(): SectionRegistryEntry[] {
  return Array.from(SECTION_REGISTRY.values());
}

/**
 * Create default homepage sections matching the existing store defaults
 */
export function getDefaultHomepageSections(siteSettings?: Partial<SiteSettings>): HomepageSectionConfig[] {
  return [
    {
      id: 'hero_banner',
      type: 'hero_banner',
      name: 'Hero Banner',
      enabled: true,
      displayOrder: 1,
      styles: {
        paddingTop: 0,
        paddingBottom: 0,
        containerWidth: 'full',
        backgroundColor: '#0a0a0a',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true,
        animationEnabled: true
      },
      heroBannerConfig: {
        autoRotate: true,
        rotationInterval: 6,
        slides: [
          {
            id: 'slide-1',
            desktopImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
            mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
            headline: siteSettings?.heroTitle || 'AUTUMN / WINTER 2026',
            subheadline: siteSettings?.heroSubtitle || 'Discover the new haute couture collection designed for modern luxury statement.',
            buttonText: siteSettings?.heroBtnText || 'EXPLORE COLLECTION',
            buttonUrl: siteSettings?.heroBtnLink || '/shop',
            overlayOpacity: 45,
            textAlignment: 'center',
            animationStyle: 'fade',
            displayOrder: 1,
            enabled: true
          },
          {
            id: 'slide-2',
            desktopImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
            mobileImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
            headline: 'LUXURY TAILORING & EVENINGWEAR',
            subheadline: 'Impeccable Italian craftsmanship meets contemporary silhouettes.',
            buttonText: 'SHOP NEW ARRIVALS',
            buttonUrl: '/new-arrivals',
            overlayOpacity: 50,
            textAlignment: 'center',
            animationStyle: 'fade',
            displayOrder: 2,
            enabled: true
          }
        ]
      }
    },
    {
      id: 'featured_categories',
      type: 'featured_categories',
      name: 'Featured Categories',
      enabled: true,
      displayOrder: 2,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      featuredCategoriesConfig: {
        title: 'SHOP BY CATEGORY',
        subtitle: 'Curated luxury apparel and accessories for elevated living.',
        categoryIds: ['women', 'men', 'bags', 'shoes', 'accessories']
      }
    },
    {
      id: 'new_arrivals',
      type: 'new_arrivals',
      name: 'New Arrivals',
      enabled: true,
      displayOrder: 3,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      featuredProductsConfig: {
        sourceType: 'automatic_newest',
        maxProducts: 8,
        desktopColumns: 4,
        mobileColumns: 2,
        title: siteSettings?.newArrivalTitle || 'NEW ARRIVALS',
        subtitle: 'The latest statement pieces added to our catalog'
      }
    },
    {
      id: 'flash_sale',
      type: 'flash_sale',
      name: 'Flash Sale',
      enabled: siteSettings?.promoEnable ?? true,
      displayOrder: 4,
      styles: {
        paddingTop: 40,
        paddingBottom: 40,
        containerWidth: 'normal',
        backgroundColor: '#111827',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      flashSaleConfig: {
        enabled: siteSettings?.promoEnable ?? true,
        title: siteSettings?.promoTitle || 'EXCLUSIVE FLASH SALE',
        announcement: siteSettings?.promoSubtitle || 'Up to 40% OFF on selected luxury items. Limited time only.',
        productIds: [],
        backgroundColor: '#111827'
      }
    },
    {
      id: 'best_sellers',
      type: 'best_sellers',
      name: 'Best Sellers',
      enabled: true,
      displayOrder: 5,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      featuredProductsConfig: {
        sourceType: 'automatic_bestseller',
        maxProducts: 8,
        desktopColumns: 4,
        mobileColumns: 2,
        title: siteSettings?.bestSellerTitle || 'BEST SELLERS',
        subtitle: 'Most coveted pieces loved by our discerning clientele'
      }
    },
    {
      id: 'collections',
      type: 'collections',
      name: 'Collections Highlight',
      enabled: true,
      displayOrder: 6,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      collectionsConfig: {
        title: 'SEASONAL COLLECTIONS',
        subtitle: 'Hand-selected themes crafted with timeless aesthetic',
        collections: [
          {
            id: 'luxury-edition',
            title: 'Luxury Edition',
            description: 'Exclusive cashmere, silk, and tailored wool coats.',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            buttonText: 'DISCOVER',
            buttonUrl: '/collections'
          },
          {
            id: 'summer-resort',
            title: 'Resort & Travel',
            description: 'Lightweight linen, silk dresses, and handcrafted leather accessories.',
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
            buttonText: 'EXPLORE',
            buttonUrl: '/collections'
          }
        ]
      }
    },
    {
      id: 'brand_story',
      type: 'brand_story',
      name: 'Brand Story',
      enabled: siteSettings?.flagShowBrands ?? true,
      displayOrder: 7,
      styles: {
        paddingTop: 56,
        paddingBottom: 56,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      brandStoryConfig: {
        title: 'CRAFTING TIMELESS ELEGANCE SINCE 2018',
        description: 'Our atelier bridges traditional European sartorial heritage with modern minimalist design. Every piece is ethically sourced, lovingly tailored, and built to transcend transient seasonal trends.',
        backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
        founderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        buttonText: 'OUR HERITAGE',
        buttonUrl: '/about'
      }
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      name: 'Customer Testimonials',
      enabled: siteSettings?.flagShowTestimonials ?? true,
      displayOrder: 8,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      testimonialsConfig: {
        title: 'WHAT OUR CLIENTS SAY',
        subtitle: 'Authentic reviews from verified fashion connoisseurs.',
        items: [
          {
            id: 'test-1',
            name: 'Sophia Laurent',
            position: 'Fashion Editor, Paris',
            rating: 5,
            review: 'The quality of tailoring is unmatched. The cashmere coat feels like a dream and arrived impeccably packaged within 48 hours.',
            customerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
          },
          {
            id: 'test-2',
            name: 'Alexander Wright',
            position: 'Architect, London',
            rating: 5,
            review: 'Subtle luxury at its finest. Clean cuts, breathable Italian fabrics, and customer support that truly goes above and beyond.',
            customerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
          }
        ]
      }
    },
    {
      id: 'instagram_feed',
      type: 'instagram_feed',
      name: 'Instagram Feed',
      enabled: siteSettings?.flagShowInstagramFeed ?? true,
      displayOrder: 9,
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        containerWidth: 'normal',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      instagramFeedConfig: {
        enabled: true,
        title: 'FOLLOW US ON INSTAGRAM',
        instagramUrl: siteSettings?.socialInstagram || 'https://instagram.com',
        numberOfPosts: 6,
        gridLayout: '6-col',
        fallbackImages: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop'
        ]
      }
    },
    {
      id: 'newsletter',
      type: 'newsletter',
      name: 'Newsletter Subscription',
      enabled: siteSettings?.flagShowNewsletter ?? true,
      displayOrder: 10,
      styles: {
        paddingTop: 56,
        paddingBottom: 56,
        containerWidth: 'normal',
        backgroundColor: '#0f172a',
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true
      },
      newsletterConfig: {
        enabled: true,
        title: 'JOIN THE MAISON CLUB',
        subtitle: 'Subscribe to receive private invitations to runway previews and exclusive discounts.',
        buttonText: 'SUBSCRIBE',
        privacyText: 'By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.',
        successMessage: 'Thank you for subscribing! Check your inbox for your 10% welcome invitation.'
      }
    }
  ];
}

/**
 * Migration helper ensuring 100% backward compatibility
 */
export function migrateHomepageConfig(siteSettings?: Partial<SiteSettings>): HomepageBuilderConfig {
  const existingConfig = siteSettings?.homepageBuilder;
  
  if (existingConfig && Array.isArray(existingConfig.sections) && existingConfig.sections.length > 0) {
    // Migration: populate missing fields on existing section configs safely
    const migratedSections = existingConfig.sections.map((section, idx) => {
      const defaultStyles = {
        paddingTop: 32,
        paddingBottom: 32,
        containerWidth: 'normal' as const,
        desktopVisible: true,
        tabletVisible: true,
        mobileVisible: true,
        animationEnabled: true
      };

      return {
        ...section,
        enabled: section.enabled ?? true,
        displayOrder: section.displayOrder ?? idx + 1,
        styles: {
          ...defaultStyles,
          ...(section.styles || {})
        }
      };
    });

    return {
      version: existingConfig.version || 1,
      futureMigrationVersion: 1,
      sections: migratedSections,
      seo: existingConfig.seo || {
        metaTitle: siteSettings?.seoTitle || siteSettings?.storeName || 'Luxury Fashion & Apparel',
        metaDescription: siteSettings?.seoMetaDescription || 'Discover hand-tailored luxury garments and accessories.',
        ogImage: siteSettings?.seoOgTitle
      },
      updatedAt: existingConfig.updatedAt || new Date().toISOString()
    };
  }

  // If no builder config exists in siteSettings, initialize from default sections
  const defaultSections = getDefaultHomepageSections(siteSettings);
  return {
    version: 1,
    futureMigrationVersion: 1,
    sections: defaultSections,
    seo: {
      metaTitle: siteSettings?.seoTitle || siteSettings?.storeName || 'Luxury Fashion & Apparel',
      metaDescription: siteSettings?.seoMetaDescription || 'Discover hand-tailored luxury garments and accessories.',
      ogImage: ''
    },
    updatedAt: new Date().toISOString()
  };
}
