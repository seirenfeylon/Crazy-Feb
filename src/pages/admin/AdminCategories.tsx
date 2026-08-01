import { useState, useMemo } from 'react';
import {
  FolderTree,
  Search,
  ArrowLeft,
  Eye,
  Edit,
  Package,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowUpDown,
  Tag,
  Filter,
} from 'lucide-react';
import { useStore } from '../../store';
import { formatBDT } from '../../data/products';

const CATEGORY_LABELS: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  accessories: 'Accessories',
  shoes: 'Shoes',
  bags: 'Bags',
};

type StatusFilter = 'all' | 'in_stock' | 'out_of_stock' | 'active' | 'draft';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high' | 'stock-low' | 'stock-high';

export function AdminCategories() {
  const { products, navigate } = useStore();

  // State for active category view
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Search, filter, and sort state for category details
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Group all products by category with high-level stats
  const categorySummaries = useMemo(() => {
    const map = new Map<
      string,
      {
        count: number;
        inStock: number;
        outOfStock: number;
        active: number;
        draft: number;
        totalValue: number;
      }
    >();

    for (const p of products) {
      const entry = map.get(p.category) ?? {
        count: 0,
        inStock: 0,
        outOfStock: 0,
        active: 0,
        draft: 0,
        totalValue: 0,
      };

      entry.count += 1;
      const isStocked = p.stock !== undefined ? p.stock > 0 : p.inStock !== false;
      if (isStocked) {
        entry.inStock += 1;
      } else {
        entry.outOfStock += 1;
      }

      if (p.published !== false) {
        entry.active += 1;
      } else {
        entry.draft += 1;
      }

      entry.totalValue += p.price;
      map.set(p.category, entry);
    }

    // Include default categories if missing from map
    const allCategories = Array.from(
      new Set([...Object.keys(CATEGORY_LABELS), ...Array.from(map.keys())])
    );

    return allCategories.map((cat) => {
      const stats = map.get(cat) ?? {
        count: 0,
        inStock: 0,
        outOfStock: 0,
        active: 0,
        draft: 0,
        totalValue: 0,
      };
      return {
        category: cat,
        label: CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1),
        ...stats,
        avgPrice: stats.count ? Math.round(stats.totalValue / stats.count) : 0,
      };
    });
  }, [products]);

  // Selected Category Data
  const selectedSummary = useMemo(() => {
    if (!selectedCategory) return null;
    return categorySummaries.find((c) => c.category === selectedCategory) || null;
  }, [categorySummaries, selectedCategory]);

  // Raw products in the selected category
  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Filtered & Sorted products for the category details view
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // 1. Search Filter (by Name or SKU)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter === 'in_stock') {
      result = result.filter((p) => (p.stock !== undefined ? p.stock > 0 : p.inStock !== false));
    } else if (statusFilter === 'out_of_stock') {
      result = result.filter((p) => (p.stock !== undefined ? p.stock === 0 : p.inStock === false));
    } else if (statusFilter === 'active') {
      result = result.filter((p) => p.published !== false);
    } else if (statusFilter === 'draft') {
      result = result.filter((p) => p.published === false);
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'oldest':
          return a.id.localeCompare(b.id);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock-low':
          return (a.stock ?? 0) - (b.stock ?? 0);
        case 'stock-high':
          return (b.stock ?? 0) - (a.stock ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [categoryProducts, searchQuery, statusFilter, sortBy]);

  // Reset filters when switching category
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  // -------------------------------------------------------------
  // VIEW: Category Details View
  // -------------------------------------------------------------
  if (selectedCategory && selectedSummary) {
    const categoryLabel = selectedSummary.label;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 hover:bg-gold-400/20 text-ink-900 dark:text-white transition-colors"
              title="Back to all categories"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-gold-600 dark:text-gold-400">
                  Category Details
                </span>
                <span className="text-ink-400">•</span>
                <span className="text-xs text-ink-500">{categoryProducts.length} Total Items</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white capitalize">
                {categoryLabel}
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate({ name: 'admin', section: 'products' })}
            className="btn-dark py-2 px-4 text-xs font-semibold"
          >
            Manage Products
          </button>
        </div>

        {/* Category Metrics Banner */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="card-lux p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900">
              <Package size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Total Products</div>
              <div className="text-lg font-bold text-ink-900 dark:text-white">{selectedSummary.count}</div>
            </div>
          </div>

          <div className="card-lux p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Active Products</div>
              <div className="text-lg font-bold text-ink-900 dark:text-white">{selectedSummary.active}</div>
            </div>
          </div>

          <div className="card-lux p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Draft Products</div>
              <div className="text-lg font-bold text-ink-900 dark:text-white">{selectedSummary.draft}</div>
            </div>
          </div>

          <div className="card-lux p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Out of Stock</div>
              <div className="text-lg font-bold text-ink-900 dark:text-white">{selectedSummary.outOfStock}</div>
            </div>
          </div>

          <div className="card-lux p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Last Synchronized</div>
              <div className="text-xs font-bold text-ink-900 dark:text-white">Just now</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card-lux p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-800 pl-10 pr-4 py-2 text-xs font-medium text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-ink-500 flex items-center gap-1">
                <ArrowUpDown size={14} /> Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2 text-xs font-semibold text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="stock-low">Stock (Low to High)</option>
                <option value="stock-high">Stock (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-black/5 dark:border-white/5">
            <span className="text-xs font-semibold text-ink-400 flex items-center gap-1 mr-1">
              <Filter size={12} /> Filter:
            </span>
            {[
              { id: 'all', label: `All (${categoryProducts.length})` },
              { id: 'in_stock', label: `In Stock (${selectedSummary.inStock})` },
              { id: 'out_of_stock', label: `Out of Stock (${selectedSummary.outOfStock})` },
              { id: 'active', label: `Active (${selectedSummary.active})` },
              { id: 'draft', label: `Draft (${selectedSummary.draft})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as StatusFilter)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  statusFilter === f.id
                    ? 'bg-gold-400 text-ink-950 font-bold shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-ink-600 dark:text-ink-300 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid / Table */}
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="card-lux p-12 text-center my-6 animate-fade-in">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold-400/10 text-gold-600 dark:text-gold-400 mb-4">
              <Package size={32} />
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
              No products found in this category
            </h3>
            <p className="mt-1 text-xs text-ink-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or filter criteria to see matching items.'
                : 'No products have been added to this category yet.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="btn-outline mt-5 text-xs py-2 px-4"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const isStocked =
                product.stock !== undefined ? product.stock > 0 : product.inStock !== false;
              const isPublished = product.published !== false;
              const hasDiscount =
                product.originalPrice && product.originalPrice > product.price;

              return (
                <div
                  key={product.id}
                  className="card-lux overflow-hidden flex flex-col hover-lift transition-all"
                >
                  {/* Product Image Thumbnail & Badges */}
                  <div className="relative aspect-square w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-ink-300">
                        <Tag size={32} />
                      </div>
                    )}

                    {/* Top Status Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isPublished ? 'Active' : 'Draft'}
                      </span>
                      {!isStocked && (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Stock Pill */}
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                      Stock: {product.stock ?? (isStocked ? 10 : 0)}
                    </div>
                  </div>

                  {/* Info Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-1">
                        <span>SKU: {product.sku || product.id.slice(0, 8).toUpperCase()}</span>
                        <span className="capitalize">{product.brand}</span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-ink-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                      <span className="text-sm font-extrabold text-ink-900 dark:text-white">
                        {formatBDT(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-ink-400 line-through font-medium">
                          {formatBDT(product.originalPrice!)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => navigate({ name: 'product', id: product.id })}
                        className="btn-outline py-1.5 text-xs font-bold inline-flex items-center justify-center gap-1"
                        title="View Public Product Page"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        disabled
                        className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-1.5 text-xs font-semibold text-ink-400 cursor-not-allowed inline-flex items-center justify-center gap-1"
                        title="Edit logic ready for future phase"
                      >
                        <Edit size={13} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: Main Category Overview Cards
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Category Management
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
            Real-time catalog distribution and category health metrics. Click any category to view its complete product list.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categorySummaries.map((c) => (
          <div
            key={c.category}
            onClick={() => handleSelectCategory(c.category)}
            className="card-lux hover-lift p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle Accent Glow on Hover */}
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gold-400/10 group-hover:bg-gold-400/20 transition-all blur-xl" />

            <div className="flex items-center justify-between relative z-10">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900 shadow-sm group-hover:scale-105 transition-transform">
                <FolderTree size={22} />
              </div>
              <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold text-gold-600 dark:text-gold-300 border border-gold-400/30">
                {c.count} items
              </span>
            </div>

            <h3 className="mt-5 font-display text-xl font-bold capitalize text-ink-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
              {c.label}
            </h3>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs border-t border-black/5 dark:border-white/5 pt-3">
              <div>
                <div className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">Active</div>
                <div className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">{c.active}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">In Stock</div>
                <div className="mt-0.5 font-bold text-ink-900 dark:text-white">{c.inStock}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">Avg Price</div>
                <div className="mt-0.5 font-bold text-ink-900 dark:text-white">৳{c.avgPrice.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-gold-600 dark:text-gold-400 group-hover:translate-x-1 transition-transform">
              <span>View & Manage Products</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
