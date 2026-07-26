export type Category = 'men' | 'women' | 'accessories' | 'shoes' | 'bags';

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
