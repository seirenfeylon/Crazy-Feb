import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, Route, SiteSettings } from './types';
import type { Lang } from './lib/translations';
import { getTranslation } from './lib/translations';
import { products as seedProducts } from './data/products';
import { db, isMockAuth } from './lib/firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { seedProductsToFirestore } from './lib/admin/productsService';

interface Toast {
  id: number;
  message: string;
}

interface StoreState {
  route: Route;
  navigate: (r: Route) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  products: Product[];
  refreshProducts: () => void;

  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;

  recentlyViewed: Product[];
  pushRecentlyViewed: (p: Product) => void;

  compare: string[];
  toggleCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;

  toasts: Toast[];
  toast: (message: string) => void;

  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;

  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  resetSiteSettings: () => Promise<void>;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // SECTION 1: ANNOUNCEMENT BAR
  announcementEnable: true,
  announcementText: 'Crafted in Italy • Free shipping over ৳15,000 • The Gilded Hour — new collection • Use WELCOME for 20% off • 30-day easy returns',
  announcementAutoScroll: true,
  announcementScrollSpeed: 15,
  announcementBgColor: '',
  announcementTextColor: '',

  // SECTION 2: PROMO BANNER
  promoEnable: true,
  promoTitle: 'The Gilded Hour',
  promoSubtitle: 'An evening capsule of cashmere and silk, finished with signature gold-thread detailing. Numbered, signed, and made to last a lifetime.',
  promoBtnText: 'Discover the collection',
  promoBtnLink: 'gilded-hour',

  // SECTION 3: DELIVERY INFORMATION
  deliveryFreeShippingText: 'Free shipping over ৳15,000',
  deliveryTime: '3–5 business days',
  deliveryReturnPolicy: '30-day easy returns',
  deliveryCodText: 'Cash on delivery available',

  // SECTION 4: CONTACT INFORMATION
  contactPhone: '+880 1700 000 000',
  contactWhatsApp: '+880 1700 000 000',
  contactEmailSupport: 'care@crazyfeb.atelier',
  contactEmailBusiness: 'business@crazyfeb.atelier',
  contactAddress: 'Gulshan Avenue, Dhaka 1212, Bangladesh',
  contactHours: 'Sat - Thu: 10:00 AM - 08:00 PM',

  // SECTION 5: SOCIAL MEDIA
  socialFacebook: 'https://facebook.com',
  socialInstagram: 'https://instagram.com',
  socialTikTok: 'https://tiktok.com',
  socialYouTube: 'https://youtube.com',
  socialLinkedIn: 'https://linkedin.com',
  socialTwitter: 'https://twitter.com',

  // SECTION 6: FOOTER
  footerCopyright: '© 2026 CrazyFeb. All rights reserved.',
  footerDescription: 'Premium fashion crafted for the modern lifestyle. Quiet luxury, made to last — designed in-house, crafted by hand.',
  footerSmallNotice: 'Visa • Mastercard • bKash • Nagad • COD',

  // SECTION 7: SEO
  seoTitle: 'CrazyFeb Atelier — Premium Quiet Luxury Fashion',
  seoMetaDescription: 'Premium fashion crafted for the modern lifestyle. Quiet luxury, made to last — designed in-house, crafted by hand.',
  seoMetaKeywords: 'luxury, fashion, cashmere, silk, handcrafted, clothing',
  seoOgTitle: 'CrazyFeb Atelier',
  seoOgDescription: 'Premium fashion crafted for the modern lifestyle.',

  // SECTION 8: STORE INFORMATION
  storeName: 'CrazyFeb',
  storeCurrency: '৳',
  storeCountry: 'Bangladesh',
  storeLanguageDefault: 'en',
  storeTimezone: 'Asia/Dhaka',

  // SECTION 9: HOMEPAGE
  heroTitle: 'Featured Collections',
  heroSubtitle: 'Considered capsules designed around a single mood — each piece made to be lived in.',
  heroBtnText: 'View all',
  heroBtnLink: 'collections',
  featuredSectionTitle: 'Featured Products',
  newArrivalTitle: 'New Arrivals',
  bestSellerTitle: 'Best Sellers',

  // SECTION 10: FEATURE FLAGS
  flagShowAnnouncement: true,
  flagShowPromoBanner: true,
  flagShowTestimonials: true,
  flagShowNewsletter: true,
  flagShowBrands: true,
  flagShowInstagramFeed: true,
  flagShowContactForm: true,
};

const StoreContext = createContext<StoreState | null>(null);

const COUPONS: Record<string, number> = {
  CRAZYFEB10: 0.1,
  LUXURY15: 0.15,
  WELCOME: 0.2,
};

function parseLocation(): Route {
  if (typeof window === 'undefined') return { name: 'home' };

  // Try hash first, e.g. #/admin/products -> /admin/products
  let rawPath = window.location.hash.replace(/^#/, '');
  if (!rawPath) {
    rawPath = window.location.pathname;
  }

  // Normalize leading/trailing slashes
  const path = '/' + rawPath.split('/').filter(Boolean).join('/');

  if (path.startsWith('/admin')) {
    const parts = path.split('/').filter(Boolean);
    const section = parts[1] as any;
    const allowed: any[] = ['dashboard', 'products', 'categories', 'orders', 'customers', 'settings', 'messages'];
    return {
      name: 'admin',
      section: allowed.includes(section) ? section : 'dashboard'
    };
  }

  if (path === '/shop') {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') as any;
    const gender = params.get('gender') as any;
    return { name: 'shop', category, gender };
  }

  if (path === '/new-arrivals') return { name: 'new-arrivals' };

  if (path === '/collections') return { name: 'collections' };

  if (path.startsWith('/collection/')) {
    const parts = path.split('/').filter(Boolean);
    return { name: 'collection', id: parts[1] || '' };
  }

  if (path.startsWith('/product/')) {
    const parts = path.split('/').filter(Boolean);
    return { name: 'product', id: parts[1] || '' };
  }

  if (path === '/about') return { name: 'about' };
  if (path === '/contact') return { name: 'contact' };
  if (path === '/checkout') return { name: 'checkout' };
  if (path === '/account') return { name: 'account' };
  if (path === '/wishlist') return { name: 'wishlist' };
  if (path === '/track') return { name: 'track' };
  if (path === '/signin') return { name: 'signin' };
  if (path === '/signup') return { name: 'signup' };
  if (path === '/forgot') return { name: 'forgot' };
  if (path === '/profile') return { name: 'profile' };

  return { name: 'home' };
}

function routeToUrl(r: Route): string {
  switch (r.name) {
    case 'home': return '/';
    case 'admin': return r.section && r.section !== 'dashboard' ? `/admin/${r.section}` : '/admin';
    case 'shop': {
      const q: string[] = [];
      if (r.category) q.push(`category=${r.category}`);
      if (r.gender) q.push(`gender=${r.gender}`);
      return q.length > 0 ? `/shop?${q.join('&')}` : '/shop';
    }
    case 'new-arrivals': return '/new-arrivals';
    case 'collections': return '/collections';
    case 'collection': return `/collection/${r.id}`;
    case 'product': return `/product/${r.id}`;
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'checkout': return '/checkout';
    case 'account': return '/account';
    case 'wishlist': return '/wishlist';
    case 'track': return '/track';
    case 'signin': return '/signin';
    case 'signup': return '/signup';
    case 'forgot': return '/forgot';
    case 'profile': return '/profile';
    default: return '/';
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parseLocation);
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crazyfeb-lang') as Lang | null;
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    }
    return 'en';
  });

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('crazyfeb-lang', nextLang);
    }
  }, []);

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const LOCAL_STORAGE_KEY = 'crazyfeb-products';
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return seedProducts;
  });

  const refreshProducts = useCallback(() => {
    if (isMockAuth) {
      if (typeof window === 'undefined') return;
      const LOCAL_STORAGE_KEY = 'crazyfeb-products';
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
            seedProducts.length = 0;
            seedProducts.push(...parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to parse products from localStorage', e);
        }
      }
    }
  }, []);

  // Realtime Firebase products listener
  useEffect(() => {
    if (isMockAuth) return;
    if (!db) return;

    // Seed products if Firestore is empty
    seedProductsToFirestore();

    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (snapshot.empty) {
          seedProductsToFirestore();
          return;
        }
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Product);
        });
        
        setProducts(list);
        seedProducts.length = 0;
        seedProducts.push(...list);
      },
      (error) => {
        console.error('Firestore realtime listener failed:', error);
      }
    );

    return () => unsub();
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // Site Settings state and loading
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crazyfeb-site-settings');
      if (saved) {
        try {
          return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse site settings from localStorage', e);
        }
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Realtime Firebase settings listener
  useEffect(() => {
    if (isMockAuth || !db) return;
    const firestore = db;

    try {
      const unsub = onSnapshot(
        doc(firestore, 'site_settings', 'general'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as Partial<SiteSettings>;
            setSiteSettings((current) => ({ ...current, ...data }));
          } else {
            // Seed Firestore with defaults if not exists
            setDoc(doc(firestore, 'site_settings', 'general'), DEFAULT_SITE_SETTINGS).catch((e) => {
              console.error('Failed to seed default site settings into Firestore', e);
            });
          }
        },
        (error) => {
          console.warn('Firestore realtime settings listener failed (using localStorage/local state):', error);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Failed to register settings onSnapshot:', e);
    }
  }, []);

  // Sync settings modifications to Firestore or localStorage
  const updateSiteSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    const nextSettings = { ...siteSettings, ...updates };
    setSiteSettings(nextSettings);

    if (typeof window !== 'undefined') {
      localStorage.setItem('crazyfeb-site-settings', JSON.stringify(nextSettings));
    }

    if (!isMockAuth && db) {
      try {
        await setDoc(doc(db, 'site_settings', 'general'), updates, { merge: true });
      } catch (err) {
        console.error('Failed to save settings to Firestore:', err);
        throw err;
      }
    }
  }, [siteSettings]);

  const resetSiteSettings = useCallback(async () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);

    if (typeof window !== 'undefined') {
      localStorage.setItem('crazyfeb-site-settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
    }

    if (!isMockAuth && db) {
      try {
        await setDoc(doc(db, 'site_settings', 'general'), DEFAULT_SITE_SETTINGS);
      } catch (err) {
        console.error('Failed to reset settings in Firestore:', err);
        toast('Settings reset locally (Cloud sync failed)');
        return;
      }
    }
    toast('Settings reset to default');
  }, [toast]);

  // Dynamically update document title and meta keywords/description
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = siteSettings.seoTitle || 'CrazyFeb Atelier — Premium Quiet Luxury Fashion';
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', siteSettings.seoMetaDescription);

      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', siteSettings.seoMetaKeywords);
    }
  }, [siteSettings]);

  // Sync back/forward button clicks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setRoute(parseLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Theme persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = (localStorage.getItem('crazyfeb-theme') || localStorage.getItem('parvej-theme')) as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      localStorage.setItem('crazyfeb-theme', saved);
      localStorage.removeItem('parvej-theme');
    }
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('crazyfeb-theme', theme);
  }, [theme]);

  // Wishlist persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('crazyfeb-wishlist') || localStorage.getItem('parvej-wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
      }
      localStorage.setItem('crazyfeb-wishlist', saved);
      localStorage.removeItem('parvej-wishlist');
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('crazyfeb-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    if (typeof window !== 'undefined') {
      try {
        const url = routeToUrl(r);
        if (window.location.pathname !== url) {
          window.history.pushState(null, '', url);
        }
      } catch (err) {
        console.warn('History pushState failed:', err);
      }
    }
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      setCart((items) => {
        const idx = items.findIndex((i) => i.product.id === product.id && i.size === size && i.color === color);
        if (idx >= 0) {
          const next = [...items];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [...items, { product, size, color, quantity }];
      });
      toast(`${product.name} added to cart`);
      setCartOpen(true);
    },
    [toast],
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((items) => items.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, delta: number) => {
    setCart((items) =>
      items
        .map((item, i) => (i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((w) => {
        if (w.includes(id)) {
          toast('Removed from wishlist');
          return w.filter((x) => x !== id);
        }
        toast('Added to wishlist');
        return [...w, id];
      });
    },
    [toast],
  );

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const pushRecentlyViewed = useCallback((p: Product) => {
    setRecentlyViewed((rv) => [p, ...rv.filter((x) => x.id !== p.id)].slice(0, 8));
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((c) => {
        if (c.includes(id)) return c.filter((x) => x !== id);
        if (c.length >= 4) {
          toast('You can compare up to 4 products');
          return c;
        }
        toast('Added to compare');
        return [...c, id];
      });
    },
    [toast],
  );

  const isCompared = useCallback((id: string) => compare.includes(id), [compare]);
  const clearCompare = useCallback(() => setCompare([]), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (COUPONS[normalized]) {
        setCoupon(normalized);
        toast(`Coupon ${normalized} applied`);
        return true;
      }
      toast('Invalid coupon code');
      return false;
    },
    [toast],
  );
  const removeCoupon = useCallback(() => setCoupon(null), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.quantity, 0), [cart]);
  const discount = useMemo(() => {
    if (!coupon) return 0;
    return Math.round(cartSubtotal * (COUPONS[coupon] || 0));
  }, [coupon, cartSubtotal]);

  const value: StoreState = {
    route,
    navigate,
    theme,
    toggleTheme,
    products,
    refreshProducts,
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    isWished,
    recentlyViewed,
    pushRecentlyViewed,
    compare,
    toggleCompare,
    isCompared,
    clearCompare,
    searchOpen,
    setSearchOpen,
    query,
    setQuery,
    toasts,
    toast,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    lang,
    setLang,
    t,
    siteSettings,
    updateSiteSettings,
    resetSiteSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
