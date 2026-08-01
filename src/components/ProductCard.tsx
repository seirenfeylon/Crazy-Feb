import { memo } from 'react';
import { Eye, Heart, GitCompare, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store';
import { formatBDT } from '../data/products';
import { Badge, Rating } from './ui';

function ProductCard({ product }: { product: Product }) {
  const { navigate, toggleWishlist, isWished, addToCart, toggleCompare, isCompared } = useStore();
  const wished = isWished(product.id);
  const compared = isCompared(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const firstImage = product.images?.[0] || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600';
  const secondImage = product.images?.[1];
  const firstSize = product.sizes?.[0] || 'Standard';
  const firstColor = product.colors?.[0]?.name || 'Default';
  const colorsList = product.colors || [];

  const getOptimizedCardUrl = (url: string) => {
    if (url && url.includes('pexels.com') && url.includes('w=900')) {
      return url.replace('w=900', 'w=600');
    }
    return url;
  };

  return (
    <div className="group card-lux hover-lift overflow-hidden">
      <div className="relative zoom-img aspect-[3/4] bg-ink-100 dark:bg-ink-700">
        <img
          src={getOptimizedCardUrl(firstImage)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* second image on hover */}
        {secondImage && (
          <img
            src={getOptimizedCardUrl(secondImage)}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && <Badge tone={product.tags?.includes('flash') ? 'red' : product.tags?.includes('limited') ? 'dark' : 'gold'}>{product.badge}</Badge>}
          {discount > 0 && <Badge tone="green">-{discount}%</Badge>}
        </div>

        {/* wishlist + compare */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className="grid h-9 w-9 place-items-center rounded-full glass-strong text-ink-700 dark:text-white transition-all duration-300 hover:scale-110 hover:text-gold-500"
          >
            <Heart size={16} className={wished ? 'fill-gold-400 text-gold-400' : ''} />
          </button>
          <button
            onClick={() => toggleCompare(product.id)}
            aria-label="Compare"
            className="grid h-9 w-9 place-items-center rounded-full glass-strong text-ink-700 dark:text-white transition-all duration-300 hover:scale-110 hover:text-gold-500"
          >
            <GitCompare size={16} className={compared ? 'text-gold-400' : ''} />
          </button>
        </div>

        {/* quick view + add to cart */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => navigate({ name: 'product', id: product.id })}
            className="flex flex-1 items-center justify-center gap-2 rounded-full glass-strong px-4 py-2.5 text-xs font-semibold text-ink-800 dark:text-white transition-all hover:bg-white dark:hover:bg-ink-800"
          >
            <Eye size={14} /> Quick View
          </button>
          <button
            onClick={() => addToCart(product, firstSize, firstColor, 1)}
            aria-label="Add to cart"
            className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white transition-all hover:bg-gold-400 hover:text-ink-900 dark:bg-white dark:text-ink-900 dark:hover:bg-gold-400"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-400">{product.brand}</span>
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <button
          onClick={() => navigate({ name: 'product', id: product.id })}
          className="mt-1.5 block w-full text-left font-display text-[15px] font-semibold leading-snug text-ink-900 dark:text-white transition-colors hover:text-gold-500"
        >
          {product.name}
        </button>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-bold text-ink-900 dark:text-white">{formatBDT(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-ink-400 line-through">{formatBDT(product.originalPrice)}</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {colorsList.slice(0, 5).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/20"
              style={{ background: c.hex }}
            />
          ))}
          {colorsList.length > 5 && (
            <span className="text-[10px] text-ink-400">+{colorsList.length - 5}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
