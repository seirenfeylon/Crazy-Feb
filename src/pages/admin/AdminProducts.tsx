import { useEffect, useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { Modal } from '../../components/admin/Modal';
import { productsRepository, type ProductInput, type ProductListRow } from '../../lib/admin/productsService';
import { useStore } from '../../store';

export function AdminProducts() {
  const { toast, refreshProducts } = useStore();
  const [rows, setRows] = useState<ProductListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductListRow | null>(null);

  const refresh = async () => {
    setLoading(true);
    const list = await productsRepository.list();
    setRows(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = async (row: ProductListRow) => {
    try {
      const full = await productsRepository.get(row.id);
      if (full) {
        setEditing(full);
      } else {
        setEditing(row);
      }
    } catch {
      setEditing(row);
    }
    setModalOpen(true);
  };

  const handleSave = async (input: ProductInput) => {
    setSaving(true);
    try {
      if (editing) {
        await productsRepository.update(editing.id, input);
        toast('✅ Product updated successfully.');
      } else {
        await productsRepository.create(input);
        toast('✅ Product created successfully.');
      }
      refreshProducts();
      setModalOpen(false);
      setEditing(null);
      await refresh();
    } catch {
      toast('❌ Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await productsRepository.remove(confirmDelete.id);
      toast('✓ Product deleted successfully');
      refreshProducts();
      setConfirmDelete(null);
      await refresh();
    } catch {
      toast('Unable to delete product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (row: ProductListRow) => {
    setSaving(true);
    try {
      const full = await productsRepository.get(row.id);
      if (full) {
        const input: ProductInput = {
          name: `${full.name} (Copy)`,
          category: full.category,
          gender: full.gender || 'unisex',
          price: full.price,
          originalPrice: full.originalPrice,
          discountPercent: full.originalPrice && full.originalPrice > full.price
            ? Math.round(((full.originalPrice - full.price) / full.originalPrice) * 100)
            : 0,
          isOnSale: !!full.originalPrice,
          stock: full.stock ?? 10,
          inStock: full.inStock !== false,
          images: full.images || [],
          description: full.description || '',
          sizes: full.sizes || [],
          colors: full.colors || [],
          tags: full.tags || [],
          badge: full.badge || '',
          published: full.published !== false,
        };
        await productsRepository.create(input);
        toast('✓ Product duplicated successfully');
        refreshProducts();
        await refresh();
      }
    } catch {
      toast('Unable to duplicate product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (row: ProductListRow) => {
    setSaving(true);
    try {
      const full = await productsRepository.get(row.id);
      if (full) {
        const input: ProductInput = {
          name: full.name,
          category: full.category,
          gender: full.gender || 'unisex',
          price: full.price,
          originalPrice: full.originalPrice,
          discountPercent: full.originalPrice && full.originalPrice > full.price
            ? Math.round(((full.originalPrice - full.price) / full.originalPrice) * 100)
            : 0,
          isOnSale: !!full.originalPrice,
          stock: full.stock ?? 10,
          inStock: full.inStock !== false,
          images: full.images || [],
          description: full.description || '',
          sizes: full.sizes || [],
          colors: full.colors || [],
          tags: full.tags || [],
          badge: full.badge || '',
          published: !full.published,
        };
        await productsRepository.update(row.id, input);
        toast(`✓ Product ${!full.published ? 'published' : 'hidden'} successfully`);
        refreshProducts();
        await refresh();
      }
    } catch {
      toast('Unable to update product status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const editingInput: ProductInput | undefined = editing
    ? {
        name: editing.name,
        category: editing.category,
        gender: editing.gender || 'unisex',
        price: editing.price,
        originalPrice: editing.originalPrice,
        discountPercent: editing.originalPrice && editing.originalPrice > editing.price
          ? Math.round(((editing.originalPrice - editing.price) / editing.originalPrice) * 100)
          : 0,
        isOnSale: !!editing.originalPrice,
        stock: editing.stock ?? 10,
        inStock: editing.inStock !== false,
        images: editing.images || (editing.image ? [editing.image] : []),
        description: editing.description || '',
        sizes: editing.sizes || [],
        colors: editing.colors || [],
        tags: editing.tags || [],
        badge: editing.badge || '',
        published: editing.published !== false,
      }
    : undefined;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-300">Manage your catalog. Add, edit, or remove products.</p>
        </div>
        <button onClick={openCreate} className="btn-gold">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <ProductTable
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setConfirmDelete}
        onDuplicate={handleDuplicate}
        onTogglePublish={handleTogglePublish}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Product' : 'Add Product'}
        subtitle={editing ? editing.name : 'Create a new product entry'}
        onClose={() => setModalOpen(false)}
      >
        <ProductForm initial={editingInput} onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
      </Modal>

      <Modal
        open={!!confirmDelete}
        title="Delete product?"
        subtitle={confirmDelete?.name}
        onClose={() => setConfirmDelete(null)}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>This action cannot be undone. The product will be permanently removed from your catalog.</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setConfirmDelete(null)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-60">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
