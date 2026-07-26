import { useEffect, useRef, useState, useMemo } from 'react';
import { MoreVertical, Pencil, Trash2, Copy, Eye, EyeOff, Search, X } from 'lucide-react';
import type { ProductListRow } from '../../lib/admin/productsService';

function ActionMenu({
  row,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
  isLastRows,
}: {
  row: ProductListRow;
  onEdit: (row: ProductListRow) => void;
  onDelete: (row: ProductListRow) => void;
  onDuplicate?: (row: ProductListRow) => void;
  onTogglePublish?: (row: ProductListRow) => void;
  isLastRows: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={toggle}
        className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
        aria-label={`Actions for ${row.name}`}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 z-50 w-48 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-900 p-1.5 shadow-lux transition-all ${
            isLastRows ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit(row);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Pencil size={14} className="text-ink-400" />
            Edit Product
          </button>

          {onDuplicate && (
            <button
              onClick={() => {
                setIsOpen(false);
                onDuplicate(row);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Copy size={14} className="text-ink-400" />
              Duplicate
            </button>
          )}

          {onTogglePublish && (
            <button
              onClick={() => {
                setIsOpen(false);
                onTogglePublish(row);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              {row.published ? (
                <>
                  <EyeOff size={14} className="text-ink-400" />
                  Hide / Draft
                </>
              ) : (
                <>
                  <Eye size={14} className="text-ink-400" />
                  Publish / Live
                </>
              )}
            </button>
          )}

          <hr className="my-1 border-black/5 dark:border-white/10" />

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(row);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 size={14} />
            Delete Product
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductTable({
  rows,
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
}: {
  rows: ProductListRow[];
  loading?: boolean;
  onEdit: (row: ProductListRow) => void;
  onDelete: (row: ProductListRow) => void;
  onDuplicate?: (row: ProductListRow) => void;
  onTogglePublish?: (row: ProductListRow) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getThumbnailUrl = (url: string) => {
    if (url && url.includes('pexels.com') && url.includes('w=900')) {
      return url.replace('w=900', 'w=150');
    }
    return url;
  };

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const nameMatch = row.name ? row.name.toLowerCase().includes(q) : false;
      const skuMatch = row.sku ? row.sku.toLowerCase().includes(q) : row.id.toLowerCase().includes(q);
      const categoryMatch = row.category ? row.category.toLowerCase().includes(q) : false;
      const brandMatch = row.brand ? row.brand.toLowerCase().includes(q) : false;
      const descriptionMatch = row.description ? row.description.toLowerCase().includes(q) : false;
      return nameMatch || skuMatch || categoryMatch || brandMatch || descriptionMatch;
    });
  }, [rows, searchQuery]);

  if (loading && rows.length === 0) {
    return (
      <div className="card-lux p-10 text-center text-sm text-ink-500 dark:text-ink-300">Loading products…</div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="card-lux p-10 text-center text-sm text-ink-500 dark:text-ink-300">
        No products yet. Add your first product to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input Container */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          className="w-full rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-ink-800 py-2.5 pl-10 pr-10 text-xs focus:border-gold-400 focus:outline-none text-ink-900 dark:text-white"
          placeholder="Search products by name, SKU, category, brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="card-lux overflow-visible">
        {filteredRows.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-500 dark:text-ink-300">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/10 bg-ink-50/60 dark:bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-300">
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-black/5 dark:border-white/5 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
                  >
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-700">
                        {row.image ? (
                          <img src={getThumbnailUrl(row.image)} alt={row.name} className="h-full w-full object-cover" loading="lazy" />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900 dark:text-white">{row.name}</td>
                    <td className="px-4 py-3 capitalize text-ink-600 dark:text-ink-300">{row.category}</td>
                    <td className="px-4 py-3 font-semibold">৳{row.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {row.discountPercent > 0 ? (
                        <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-xs font-semibold text-gold-600 dark:text-gold-300">
                          {row.discountPercent}%
                        </span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={row.stock === 0 ? 'text-red-500 font-semibold' : 'text-ink-600 dark:text-ink-300'}>
                        {row.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.published ? (
                        row.inStock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:text-red-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Out
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionMenu
                        row={row}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onTogglePublish={onTogglePublish}
                        isLastRows={index >= filteredRows.length - 2 && filteredRows.length > 2}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
