export type Category = 'men' | 'women' | 'accessories' | 'shoes' | 'bags';

export interface SizeChartEntry {
  size: string;
  chest?: number; // cm
  waist?: number; // cm
  hip?: number;   // cm
  length?: number; // cm
  sleeve?: number; // cm
}

export interface UserBodyProfile {
  heightCm?: number;
  weightKg?: number;
  gender?: 'men' | 'women' | 'unisex';
  age?: number;
  bodyType?: 'slim' | 'regular' | 'athletic' | 'broad' | 'plus_size';
  preferredFit?: 'slim' | 'regular' | 'relaxed' | 'oversized';
  updatedAt?: string;
}

export interface SizeRecommendation {
  recommendedSize: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
  bodyEstimates: {
    estimatedChestCm: number;
    estimatedWaistCm: number;
    estimatedHipCm: number;
  };
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  tags: ('new' | 'bestseller' | 'trending' | 'limited' | 'flash')[];
  badge?: string;
  inStock: boolean;
  reviews: Review[];
  published?: boolean;
  stock?: number;
  sku?: string;
  sizeChart?: SizeChartEntry[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: Category; gender?: 'men' | 'women' }
  | { name: 'new-arrivals' }
  | { name: 'collections' }
  | { name: 'collection'; id: string }
  | { name: 'product'; id: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'checkout' }
  | { name: 'account' }
  | { name: 'wishlist' }
  | { name: 'track' }
  | { name: 'signin' }
  | { name: 'signup' }
  | { name: 'forgot' }
  | { name: 'profile' }
  | { name: 'admin'; section?: AdminSection };

export type AdminSection = 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings' | 'messages';

export interface SiteSettings {
  // SECTION 1: ANNOUNCEMENT BAR
  announcementEnable: boolean;
  announcementText: string;
  announcementAutoScroll: boolean;
  announcementScrollSpeed: number;
  announcementBgColor: string;
  announcementTextColor: string;

  // SECTION 2: PROMO BANNER
  promoEnable: boolean;
  promoTitle: string;
  promoSubtitle: string;
  promoBtnText: string;
  promoBtnLink: string;

  // SECTION 3: DELIVERY INFORMATION
  deliveryFreeShippingText: string;
  deliveryTime: string;
  deliveryReturnPolicy: string;
  deliveryCodText: string;

  // SECTION 4: CONTACT INFORMATION
  contactPhone: string;
  contactWhatsApp: string;
  contactEmailSupport: string;
  contactEmailBusiness: string;
  contactAddress: string;
  contactHours: string;

  // SECTION 5: SOCIAL MEDIA
  socialFacebook: string;
  socialInstagram: string;
  socialTikTok: string;
  socialYouTube: string;
  socialLinkedIn: string;
  socialTwitter: string;

  // SECTION 6: FOOTER
  footerCopyright: string;
  footerDescription: string;
  footerSmallNotice: string;

  // SECTION 7: SEO
  seoTitle: string;
  seoMetaDescription: string;
  seoMetaKeywords: string;
  seoOgTitle: string;
  seoOgDescription: string;

  // SECTION 8: STORE INFORMATION
  storeName: string;
  storeCurrency: string;
  storeCountry: string;
  storeLanguageDefault: string;
  storeTimezone: string;

  // SECTION 9: HOMEPAGE
  heroTitle: string;
  heroSubtitle: string;
  heroBtnText: string;
  heroBtnLink: string;
  featuredSectionTitle: string;
  newArrivalTitle: string;
  bestSellerTitle: string;

  // SECTION 10: FEATURE FLAGS
  flagShowAnnouncement: boolean;
  flagShowPromoBanner: boolean;
  flagShowTestimonials: boolean;
  flagShowNewsletter: boolean;
  flagShowBrands: boolean;
  flagShowInstagramFeed: boolean;
  flagShowContactForm: boolean;
  flagEnableSizePredictor?: boolean;

  // SECTION 11: PAYMENT SETTINGS
  paymentGateways?: PaymentGatewayConfig[];

  // SECTION 12: SHIPPING SETTINGS
  defaultShippingFee?: number;
  freeShippingThreshold?: number;
  freeShippingEnabled?: boolean;
  freeShippingMessage?: string;
  shippingCurrency?: string;
  estimatedDeliveryTime?: string;
  processingTime?: string;
  maxDeliveryDays?: number;

  // Delivery Zones & Methods
  deliveryZones?: DeliveryZoneConfig[];
  deliveryMethods?: DeliveryMethodConfig[];

  // Local Pickup Configuration
  localPickupEnabled?: boolean;
  localPickupAddress?: string;
  localPickupInstructions?: string;
  localPickupBusinessHours?: string;
  localPickupContactNumber?: string;

  // Shipping Restrictions
  maxOrderWeightKg?: number;
  restrictedDistricts?: string[];
  disableHolidayDelivery?: boolean;
  disableWeekendDelivery?: boolean;

  // SECTION 13: HOMEPAGE BUILDER
  homepageBuilder?: HomepageBuilderConfig;
  homepageBuilderDraft?: HomepageBuilderConfig;
  homepageBuilderVersions?: HomepageBuilderVersionSnapshot[];
  homepageBuilderLock?: HomepageBuilderLock;
}

// ==========================================
// HOMEPAGE BUILDER TYPES (SHOPIFY-STYLE)
// ==========================================

export type HomepageSectionType =
  | 'hero_banner'
  | 'featured_categories'
  | 'new_arrivals'
  | 'best_sellers'
  | 'flash_sale'
  | 'featured_products'
  | 'collections'
  | 'brand_story'
  | 'testimonials'
  | 'instagram_feed'
  | 'newsletter'
  | 'footer_cta';

export interface GlobalSectionStyles {
  paddingTop?: number;
  paddingBottom?: number;
  containerWidth?: 'narrow' | 'normal' | 'wide' | 'full';
  backgroundColor?: string;
  backgroundImage?: string;
  borderRadius?: number;
  animationEnabled?: boolean;
  desktopVisible?: boolean;
  tabletVisible?: boolean;
  mobileVisible?: boolean;
}

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  headline: string;
  subheadline?: string;
  buttonText?: string;
  buttonUrl?: string;
  overlayOpacity?: number;
  textAlignment?: 'left' | 'center' | 'right';
  animationStyle?: 'fade' | 'slide' | 'zoom';
  displayOrder: number;
  enabled: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface HeroBannerConfig {
  slides: HeroSlide[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

export interface FeaturedProductsConfig {
  sourceType: 'automatic_newest' | 'automatic_bestseller' | 'automatic_views' | 'automatic_rated' | 'manual';
  manualProductIds?: string[];
  maxProducts: number;
  desktopColumns: 2 | 3 | 4 | 5;
  mobileColumns: 1 | 2;
  title?: string;
  subtitle?: string;
}

export interface FeaturedCategoriesConfig {
  title?: string;
  subtitle?: string;
  categoryIds: string[];
  bannerImages?: Record<string, string>;
}

export interface FlashSaleConfig {
  enabled: boolean;
  title?: string;
  announcement?: string;
  startDate?: string;
  endDate?: string;
  productIds: string[];
  backgroundColor?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  linkedProductIds?: string[];
}

export interface CollectionsConfig {
  title?: string;
  subtitle?: string;
  collections: CollectionItem[];
}

export interface BrandStoryConfig {
  title: string;
  description: string;
  backgroundImage?: string;
  founderImage?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface TestimonialItem {
  id: string;
  customerPhoto?: string;
  name: string;
  position?: string;
  rating: number;
  review: string;
}

export interface TestimonialsConfig {
  title?: string;
  subtitle?: string;
  items: TestimonialItem[];
}

export interface InstagramFeedConfig {
  enabled: boolean;
  title?: string;
  instagramUrl?: string;
  numberOfPosts: number;
  gridLayout: '3-col' | '4-col' | '6-col';
  fallbackImages?: string[];
}

export interface NewsletterConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  privacyText?: string;
  successMessage?: string;
}

export interface HomepageSectionConfig {
  id: string;
  type: HomepageSectionType;
  name: string;
  enabled: boolean;
  displayOrder: number;
  styles: GlobalSectionStyles;
  lastUpdated?: string;
  createdAt?: string;
  version?: number;
  
  heroBannerConfig?: HeroBannerConfig;
  featuredProductsConfig?: FeaturedProductsConfig;
  featuredCategoriesConfig?: FeaturedCategoriesConfig;
  flashSaleConfig?: FlashSaleConfig;
  collectionsConfig?: CollectionsConfig;
  brandStoryConfig?: BrandStoryConfig;
  testimonialsConfig?: TestimonialsConfig;
  instagramFeedConfig?: InstagramFeedConfig;
  newsletterConfig?: NewsletterConfig;
}

export interface HomepageSEOConfig {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredDataPlaceholder?: string;
}

export interface HomepageBuilderLock {
  lockedBy: string;
  lockedByName?: string;
  lockedAt: string;
  expiresAt: string;
}

export interface HomepageBuilderVersionSnapshot {
  id: string;
  timestamp: string;
  adminName?: string;
  adminEmail?: string;
  note?: string;
  sections: HomepageSectionConfig[];
  seo?: HomepageSEOConfig;
}

export interface HomepageBuilderConfig {
  version: number;
  futureMigrationVersion?: number;
  sections: HomepageSectionConfig[];
  seo?: HomepageSEOConfig;
  updatedAt?: string;
  lastPublishedAt?: string;
  lastPublishedBy?: string;
}

export interface DeliveryZoneConfig {
  id: string;
  name: string;
  districts: string[]; // e.g., ["Dhaka", "Gazipur", "Narayanganj"]
  charge: number;
  estimatedDelivery: string;
  expressAvailable: boolean;
  codAvailable: boolean;
  enabled: boolean;
}

export interface DeliveryMethodConfig {
  id: string; // 'std' | 'exp' | 'pickup'
  title: string;
  description: string;
  estimatedTime: string;
  defaultCharge: number;
  enabled: boolean;
}

export interface PaymentGatewayConfig {
  id: string; // 'cod' | 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'stripe' | 'paypal'
  name: string;
  enabled: boolean;
  description: string;
  iconName: string;
  sortOrder: number;
  instructions?: string;
  merchantNumber?: string;
  isFutureIntegration?: boolean;
  sandboxMode?: boolean;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  orderNumber?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  updatesEmail?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
