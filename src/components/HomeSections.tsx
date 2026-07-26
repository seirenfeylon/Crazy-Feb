import { useEffect, useState, useMemo } from 'react';
import { ArrowRight, Check, Flame, Gem, Instagram, Quote, Send, Sparkles, Star, Tag, Truck } from 'lucide-react';
import { useStore } from '../store';
import { useReveal, useRipple } from '../hooks';
import { collections, instagramPosts, testimonials } from '../data/products';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { SectionHeading } from './ui';

export function Marquee() {
  const { siteSettings } = useStore();

  if (!siteSettings.flagShowAnnouncement || !siteSettings.announcementEnable) {
    return null;
  }

  const text = siteSettings.announcementText || '';
  const rawParts = text.split(/[•|;]/).map(x => x.trim()).filter(Boolean);
  const icons = [
    <Gem size={14} />,
    <Truck size={14} />,
    <Sparkles size={14} />,
    <Tag size={14} />,
    <Check size={14} />
  ];

  const items = rawParts.map((t, idx) => ({
    icon: icons[idx % icons.length],
    text: t
  }));

  const speed = siteSettings.announcementScrollSpeed || 15;
  const duration = 280 / speed;

  return (
    <div
      className="border-y border-black/5 dark:border-white/10 bg-white dark:bg-ink-900"
      style={{
        backgroundColor: siteSettings.announcementBgColor || undefined,
        color: siteSettings.announcementTextColor || undefined,
      }}
    >
      <div className="overflow-hidden py-4">
        <div
          className="marquee"
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: siteSettings.announcementAutoScroll ? 'running' : 'paused',
            animation: siteSettings.announcementAutoScroll ? undefined : 'none',
          }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {items.map((it, j) => (
                <span
                  key={j}
                  className="flex items-center gap-2 px-6 text-xs font-medium tracking-wide text-ink-600 dark:text-ink-300"
                  style={{ color: siteSettings.announcementTextColor || undefined }}
                >
                  <span className="text-gold-500">{it.icon}</span>
                  {it.text}
                  <span className="ml-6 text-ink-300">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturedCollections() {
  const { navigate, siteSettings } = useStore();
  const ref = useReveal<HTMLDivElement>();

  const getBtnRoute = (link: string): any => {
    const l = link.trim().toLowerCase();
    if (l === 'collections') return { name: 'collections' };
    if (l === 'shop') return { name: 'shop' };
    if (l === 'about') return { name: 'about' };
    if (l === 'contact') return { name: 'contact' };
    return { name: 'collection', id: link };
  };

  return (
    <section className="container-lux pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div ref={ref} className="reveal">
        <SectionHeading
          eyebrow="Curated edits"
          title={siteSettings.heroTitle || "Featured Collections"}
          subtitle={siteSettings.heroSubtitle || "Considered capsules designed around a single mood — each piece made to be lived in."}
          action={
            <button onClick={() => navigate(getBtnRoute(siteSettings.heroBtnLink || 'collections'))} className="btn-ghost">
              {siteSettings.heroBtnText || "View all"} <ArrowRight size={16} />
            </button>
          }
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {collections.map((c, i) => {
            const isFeature = i === 0 || i === 3;
            return (
              <button
                key={c.id}
                onClick={() => navigate({ name: 'collection', id: c.id })}
                className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-500 hover:shadow-lift animate-fade-up ${
                  isFeature ? 'lg:col-span-7 aspect-[16/11]' : 'lg:col-span-5 aspect-[16/11]'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="zoom-img absolute inset-0">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
                <div className="absolute inset-0 border border-white/0 transition-all duration-500 group-hover:border-gold-300/40 rounded-3xl" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">
                    <span className="h-px w-6 bg-gold-300" /> {c.count} pieces
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{c.name}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/80">{c.tagline}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:gap-3 group-hover:text-gold-300">
                    Discover the edit <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductRow({
  id,
  eyebrow,
  title,
  subtitle,
  filter,
  limit = 4,
  cta,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  filter: (p: Product) => boolean;
  limit?: number;
  cta?: { label: string; route: any };
}) {
  const { navigate, products } = useStore();
  const ref = useReveal<HTMLDivElement>();
  const list = useMemo(() => {
    return products.filter((p) => p.published !== false && filter(p)).slice(0, limit);
  }, [products, filter, limit]);
  return (
    <section id={id} className="container-lux py-16 sm:py-20">
      <div ref={ref} className="reveal">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            cta && (
              <button onClick={() => navigate(cta.route)} className="btn-ghost">
                {cta.label} <ArrowRight size={16} />
              </button>
            )
          }
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlashSale() {
  const { navigate, products } = useStore();
  const ref = useReveal<HTMLDivElement>();
  const [time, setTime] = useState({ h: 12, m: 48, s: 30 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((p) => {
        let s = p.s - 1;
        let m = p.m;
        let h = p.h;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 12; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const flashProducts = useMemo(() => {
    return products.filter((p) => p.tags.includes('flash')).slice(0, 2);
  }, [products]);

  const getOptimizedImgUrl = (url: string) => {
    if (url && url.includes('pexels.com') && url.includes('w=900')) {
      return url.replace('w=900', 'w=600');
    }
    return url;
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <section className="container-lux py-16 sm:py-20">
      <div ref={ref} className="reveal relative overflow-hidden rounded-2xl bg-ink-900 p-8 text-white sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="eyebrow text-gold-300">48 hours only</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Flash Sale — up to 40% off</h2>
            <p className="mt-3 max-w-md text-sm text-white/80">
              A curated edit of premium essentials at exceptional prices. When they are gone, they are gone.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { v: pad(time.h), l: 'Hrs' },
                { v: pad(time.m), l: 'Min' },
                { v: pad(time.s), l: 'Sec' },
              ].map((t) => (
                <div key={t.l} className="grid h-16 w-16 place-items-center rounded-xl glass-strong text-center">
                  <div className="font-display text-2xl font-bold text-white">{t.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/70">{t.l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-gold mt-7">
              <Flame size={16} /> Shop the sale
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {flashProducts.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl bg-white/5">
                <img src={getOptimizedImgUrl(p.images[0])} alt={p.name} className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PremiumCategories() {
  const { navigate } = useStore();
  const ref = useReveal<HTMLDivElement>();
  const cats = [
    { name: 'Men', image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=900', route: { name: 'shop', gender: 'men' } as const },
    { name: 'Women', image: 'https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=900', route: { name: 'shop', gender: 'women' } as const },
    { name: 'Shoes', image: 'https://images.pexels.com/photos/7679726/pexels-photo-7679726.jpeg?auto=compress&cs=tinysrgb&w=900', route: { name: 'shop', category: 'shoes' } as const },
    { name: 'Bags', image: 'https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=900', route: { name: 'shop', category: 'bags' } as const },
    { name: 'Accessories', image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=900', route: { name: 'shop', category: 'accessories' } as const },
  ];
  return (
    <section className="container-lux py-16 sm:py-20">
      <div ref={ref} className="reveal">
        <SectionHeading eyebrow="Shop by category" title="Premium Categories" subtitle="Find your edit across menswear, womenswear, and accessories." />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cats.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(c.route)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <div className="zoom-img absolute inset-0">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white">
                <h3 className="font-display text-lg font-bold">{c.name}</h3>
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-white/80 transition-all group-hover:gap-2 group-hover:text-gold-300">
                  Shop now <ArrowRight size={12} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomerReviews() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-white dark:bg-ink-900 py-20 sm:py-24">
      <div className="container-lux">
        <div ref={ref} className="reveal">
          <SectionHeading
            eyebrow="Loved by 50,000+ clients"
            title="What Our Clients Say"
            subtitle="Real words from real customers who made CrazyFeb part of their everyday wardrobe."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card-lux hover-lift p-7">
                <Quote className="text-gold-400" size={28} />
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-black/5 dark:border-white/10 pt-5">
                  <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-ink-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-ink-500 dark:text-ink-300">{t.role}</div>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstagramFeed() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="container-lux py-20 sm:py-24">
      <div ref={ref} className="reveal">
        <SectionHeading
          eyebrow="@crazyfeb.atelier"
          title="From Our Instagram"
          subtitle="Tag #WearCrazyFeb for a chance to be featured."
          align="center"
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((p) => (
            <a
              key={p.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <div className="zoom-img absolute inset-0">
                <img src={p.image} alt="Instagram post" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                <Instagram size={20} className="text-white" />
              </div>
              <div className="absolute bottom-2 right-2 rounded-full glass-strong px-2 py-1 text-[10px] font-semibold text-white">
                {p.likes}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const ref = useReveal<HTMLDivElement>();
  const ripple = useRipple();
  const { toast } = useStore();
  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast('Please enter a valid email');
      return;
    }
    toast('Subscribed — check your inbox for 20% off');
    setEmail('');
  };
  return (
    <section className="container-lux py-16 sm:py-20">
      <div ref={ref} className="reveal relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-ink-50 dark:bg-ink-800 p-8 sm:p-14">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Join the CrazyFeb circle</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Get 20% off your first order</h2>
            <p className="mt-3 max-w-md text-sm text-ink-600 dark:text-ink-300">
              Be the first to know about new collections, private sales, and styling notes — straight to your inbox.
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input-lux flex-1"
              aria-label="Email address"
            />
            <button onMouseDown={ripple} className="ripple-container btn-dark">
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function LimitedEditionBanner() {
  const { navigate, siteSettings } = useStore();
  const ref = useReveal<HTMLDivElement>();

  if (!siteSettings.flagShowPromoBanner || !siteSettings.promoEnable) {
    return null;
  }

  const getBtnRoute = (link: string): any => {
    const l = link.trim().toLowerCase();
    if (l === 'collections') return { name: 'collections' };
    if (l === 'shop') return { name: 'shop' };
    if (l === 'about') return { name: 'about' };
    if (l === 'contact') return { name: 'contact' };
    return { name: 'collection', id: link };
  };

  return (
    <section className="container-lux py-16 sm:py-20">
      <div ref={ref} className="reveal relative overflow-hidden rounded-2xl">
        <img
          src="https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Limited edition"
          className="h-[420px] w-full object-cover sm:h-[480px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-lg p-8 text-white sm:p-14">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
              <Gem size={12} className="text-gold-300" /> Limited to 200 pieces
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {siteSettings.promoTitle || "The Gilded Hour"}
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              {siteSettings.promoSubtitle || "An evening capsule of cashmere and silk, finished with signature gold-thread detailing. Numbered, signed, and made to last a lifetime."}
            </p>
            <button
              onClick={() => navigate(getBtnRoute(siteSettings.promoBtnLink || 'gilded-hour'))}
              className="btn-gold mt-7"
            >
              {siteSettings.promoBtnText || "Discover the collection"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
