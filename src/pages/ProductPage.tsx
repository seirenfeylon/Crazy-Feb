import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Check, GitCompare, Heart, Minus, Plus, RefreshCw, Shield, ShoppingBag, Star, Truck, ZoomIn } from 'lucide-react';
import { useStore } from '../store';
import { formatBDT } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Rating } from '../components/ui';

export default function ProductPage({ id }: { id: string }) {
  const { navigate, addToCart, toggleWishlist, isWished, toggleCompare, isCompared, pushRecentlyViewed, products, t, siteSettings } = useStore();
  const product = products.find((p) => p.id === id) || products[0];
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useEffect(() => {
    pushRecentlyViewed(product);
    setActiveImg(0);
    setSize(product.sizes[0]);
    setColor(product.colors[0].name);
    setQty(1);
  }, [product, pushRecentlyViewed]);

  const wished = isWished(product.id);
  const compared = isCompared(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const recommended = useMemo(() => {
    const list = products.filter((p) => p.published !== false && p.id !== product.id && p.category === product.category).slice(0, 4);
    if (list.length < 4) {
      list.push(...products.filter((p) => p.published !== false && p.id !== product.id && !list.includes(p)).slice(0, 4 - list.length));
    }
    return list;
  }, [products, product.id, product.category]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="container-lux py-8">
      <button onClick={() => navigate({ name: 'shop' })} className="mb-6 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> {t('Continue Shopping')}
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800"
            onMouseMove={onMouseMove}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300"
              style={zoom.on ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass-strong text-ink-700 dark:text-white">
              <ZoomIn size={15} />
            </div>
            {discount > 0 && (
              <div className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white">-{discount}%</div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${i === activeImg ? 'border-gold-400' : 'border-transparent opacity-80 hover:opacity-100'}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">{product.brand}</span>
            {product.badge && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-900">{product.badge}</span>}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} size={16} />
            <span className="text-sm text-ink-400">•</span>
            <span className="text-sm text-emerald-600 font-medium">{t('In Stock')}</span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-3xl font-bold">{formatBDT(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-ink-400 line-through">{formatBDT(product.originalPrice)}</span>}
            {discount > 0 && <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">Save {formatBDT((product.originalPrice || 0) - product.price)}</span>}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{product.description}</p>

          {/* Color */}
          <div className="mt-7">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-500">Color — <span className="text-ink-900 dark:text-white">{color}</span></div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`h-10 w-10 rounded-full ring-2 transition-all ${color === c.name ? 'ring-gold-400 ring-offset-2 dark:ring-offset-ink-50' : 'ring-black/10 dark:ring-white/20 hover:scale-105'}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink-500">Size</span>
              <button className="text-xs text-gold-600 hover:underline">Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[3rem] rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${size === s ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900' : 'border-black/10 dark:border-white/15 hover:border-ink-900 dark:hover:border-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-black/10 dark:border-white/15 p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Minus size={15} /></button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Plus size={15} /></button>
            </div>
            <button onClick={() => addToCart(product, size, color, qty)} className="btn-dark flex-1 min-w-[180px]">
              <ShoppingBag size={16} /> {t('Add to Cart')}
            </button>
            <button onClick={() => { addToCart(product, size, color, qty); navigate({ name: 'checkout' }); }} className="btn-gold flex-1 min-w-[180px]">
              {t('Buy Now')}
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={() => toggleWishlist(product.id)} className="btn-ghost flex-1"><Heart size={15} className={wished ? 'fill-gold-400 text-gold-400' : ''} /> {t('Wishlist')}</button>
            <button onClick={() => toggleCompare(product.id)} className="btn-ghost flex-1"><GitCompare size={15} className={compared ? 'text-gold-400' : ''} /> Compare</button>
          </div>

          {/* Assurances */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              { icon: <Truck size={16} />, t: siteSettings.deliveryFreeShippingText || 'Free shipping', s: 'Complimentary standard' },
              { icon: <RefreshCw size={16} />, t: siteSettings.deliveryReturnPolicy || '30-day returns', s: 'Easy & free' },
              { icon: <Shield size={16} />, t: siteSettings.deliveryCodText || 'Authenticity', s: 'Guaranteed' },
            ].map((a, idx) => (
              <div key={idx} className="rounded-xl border border-black/5 dark:border-white/10 p-3 text-center">
                <div className="mx-auto mb-1.5 grid h-9 w-9 place-items-center rounded-full bg-gold-400/15 text-gold-600">{a.icon}</div>
                <div className="text-xs font-semibold">{a.t}</div>
                <div className="text-[10px] text-ink-500">{a.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-2 border-b border-black/5 dark:border-white/10">
          {([['details', 'Product Details'], ['reviews', `Reviews (${product.reviews.length})`], ['shipping', 'Shipping & Returns']] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors ${tab === k ? 'text-ink-900 dark:text-white' : 'text-ink-500 hover:text-ink-800 dark:hover:text-white'}`}
            >
              {l}
              {tab === k && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-400" />}
            </button>
          ))}
        </div>
        <div className="py-7">
          {tab === 'details' && (
            <div className="grid gap-6 sm:grid-cols-2">
              <ul className="space-y-2.5">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200"><Check size={16} className="mt-0.5 text-gold-500" /> {d}</li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{product.description} Crafted with intention, this piece reflects CrazyFeb's commitment to quality, longevity, and quiet luxury.</p>
            </div>
          )}
          {tab === 'reviews' && (
            <div className="space-y-5">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-black/5 dark:border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white dark:bg-white dark:text-ink-900 font-bold">{r.name[0]}</div>
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-xs text-ink-500">{new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} className="text-gold-400 fill-gold-400" />)}</div>
                  </div>
                  <h4 className="mt-3 font-semibold">{r.title}</h4>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{r.body}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'shipping' && (
            <div className="space-y-3 text-sm text-ink-600 dark:text-ink-300">
              <p><strong className="text-ink-900 dark:text-white">Shipping.</strong> {siteSettings.deliveryFreeShippingText || 'Complimentary standard shipping on all orders over ৳15,000.'} Estimated delivery: {siteSettings.deliveryTime || '3–5 business days'}.</p>
              <p><strong className="text-ink-900 dark:text-white">Returns.</strong> Enjoy easy {siteSettings.deliveryReturnPolicy || '30-day returns'} on unworn pieces. Refund is processed within 5 business days.</p>
              <p><strong className="text-ink-900 dark:text-white">Delivery.</strong> {siteSettings.deliveryCodText || 'Cash on delivery available nationwide.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended */}
      <section className="mt-10">
        <h2 className="section-title mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
