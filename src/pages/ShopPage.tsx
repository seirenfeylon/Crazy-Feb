import { useMemo, useState } from 'react';
import { Check, GitCompare, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import type { Category } from '../types';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'new';

export default function ShopPage({ initialCategory, initialGender, onlyNew = false }: { initialCategory?: Category; initialGender?: 'men' | 'women'; onlyNew?: boolean }) {
  const { navigate, compare, toggleCompare, clearCompare, products, t } = useStore();
  const [category, setCategory] = useState<Category | 'all'>(initialCategory || 'all');
  const [gender, setGender] = useState<'all' | 'men' | 'women'>(initialGender || 'all');
  const [sort, setSort] = useState<Sort>('featured');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [onSale, setOnSale] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (p.published === false) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (gender !== 'all' && p.gender !== gender && p.gender !== 'unisex') return false;
      if (p.price > maxPrice) return false;
      if (onSale && !p.originalPrice) return false;
      if (onlyNew && !p.tags.includes('new')) return false;
      return true;
    });
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'new': list = [...list].sort((a, b) => (b.tags.includes('new') ? 1 : 0) - (a.tags.includes('new') ? 1 : 0)); break;
    }
    return list;
  }, [category, gender, maxPrice, onSale, sort, products, onlyNew]);

  const cats: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'bags', label: 'Bags' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">{t('Category')}</h4>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${category === c.id ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:bg-ink-200 dark:hover:bg-ink-700'}`}
            >
              {t(c.label)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">{t('Gender')}</h4>
        <div className="flex gap-2">
          {(['all', 'men', 'women'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`rounded-full px-3.5 py-2 text-xs font-semibold capitalize transition-all ${gender === g ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200'}`}
            >
              {g === 'all' ? t('All') : (g === 'men' ? t('Men') : t('Women'))}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">{t('Price')} — ৳{maxPrice.toLocaleString()}</h4>
        <input type="range" min={2000} max={50000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-gold-500" />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="h-4 w-4 accent-gold-500" />
        {t('Sale') + ' ' + t('All Products').replace('সকল পণ্য', 'পণ্য')}
      </label>
    </div>
  );

  return (
    <div className="container-lux py-10">
      <div className="mb-8">
        <div className="eyebrow">{onlyNew ? t('New Arrivals') : t('Shop')}</div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          {onlyNew ? t('New Arrivals') : (category === 'all' ? t('All Pieces') : cats.find((c) => c.id === category)?.label)}
          {gender !== 'all' && ` — ${gender === 'men' ? "Men's" : "Women's"}`}
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{filtered.length} pieces</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl glass p-6">
            {FilterPanel}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-4 py-2.5 text-sm font-semibold lg:hidden">
              <SlidersHorizontal size={15} /> {t('Filter')}
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-xs text-ink-500 sm:inline">{t('Sort By')}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-ink-800 px-4 py-2.5 text-sm font-medium outline-none focus:border-gold-400">
                <option value="featured">{t('Featured')}</option>
                <option value="new">{t('New')}</option>
                <option value="price-asc">{t('Price')}: Low to High</option>
                <option value="price-desc">{t('Price')}: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 dark:border-white/15 py-24 text-center">
              <div>
                <p className="font-display text-xl font-semibold">{t('No Products Found')}</p>
                <p className="mt-1 text-sm text-ink-500">Try adjusting the price range or category.</p>
                <button onClick={() => { setCategory('all'); setGender('all'); setMaxPrice(50000); setOnSale(false); }} className="btn-ghost mt-4">{t('Reset')}</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-3xl px-4 pb-4">
          <div className="flex items-center gap-3 rounded-2xl glass-strong shadow-lift p-3">
            <span className="flex items-center gap-2 text-sm font-semibold"><GitCompare size={16} className="text-gold-500" /> Compare ({compare.length})</span>
            <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
              {compare.map((id) => {
                const p = products.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex shrink-0 items-center gap-2 rounded-full bg-ink-100 dark:bg-ink-800 pl-1 pr-2 py-1">
                    <img src={p.images[0]} alt="" className="h-7 w-7 rounded-full object-cover" />
                    <span className="text-xs font-medium">{p.name.slice(0, 18)}…</span>
                    <button onClick={() => toggleCompare(id)} aria-label="Remove"><X size={12} /></button>
                  </div>
                );
              })}
            </div>
            <button onClick={clearCompare} className="rounded-full px-3 py-2 text-xs font-semibold text-ink-500 hover:text-ink-900 dark:hover:text-white">Clear</button>
            <button onClick={() => navigate({ name: 'shop' })} className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-ink-900">Compare now</button>
          </div>
        </div>
      )}

      {/* Mobile filters drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${filtersOpen ? '' : 'pointer-events-none'}`} aria-hidden={!filtersOpen}>
        <div className={`absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${filtersOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setFiltersOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-[86%] max-w-sm glass-strong shadow-lift border-r border-white/20 transition-transform duration-500 ${filtersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg font-bold">Filters</span>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X size={18} /></button>
          </div>
          <div className="px-5 pb-8">{FilterPanel}</div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <button onClick={() => setFiltersOpen(false)} className="btn-dark w-full"><Check size={16} /> Show {filtered.length} results</button>
          </div>
        </div>
      </div>
    </div>
  );
}
