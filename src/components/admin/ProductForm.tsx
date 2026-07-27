import { useEffect, useState, useRef } from 'react';
import { Save, X, Plus, Trash2, Upload, Eye, EyeOff, Check, Palette } from 'lucide-react';
import type { Category, Product } from '../../types';
import type { ProductInput } from '../../lib/admin/productsService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isMockAuth } from '../../lib/firebase';
import { useStore } from '../../store';

const CATEGORIES: Category[] = ['men', 'women', 'accessories', 'shoes', 'bags'];
const GENDERS: Product['gender'][] = ['men', 'women', 'unisex'];

const EMPTY: ProductInput = {
  name: '',
  category: 'men',
  gender: 'unisex',
  price: 0,
  originalPrice: undefined,
  discountPercent: 0,
  isOnSale: false,
  stock: 10,
  inStock: true,
  images: [],
  description: '',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [
    { name: 'Black', hex: '#0A0A0A' },
    { name: 'Ivory', hex: '#F4F1EA' }
  ],
  tags: ['new'],
  badge: '',
  published: true,
};

const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_SHOES = ['40', '41', '42', '43', '44', '45'];

function isProductInputEqual(a: ProductInput, b?: ProductInput): boolean {
  if (!b) return false;
  return (
    a.name.trim() === b.name.trim() &&
    a.category === b.category &&
    a.gender === b.gender &&
    a.price === b.price &&
    (a.originalPrice ?? null) === (b.originalPrice ?? null) &&
    a.discountPercent === b.discountPercent &&
    a.isOnSale === b.isOnSale &&
    a.stock === b.stock &&
    a.inStock === b.inStock &&
    a.description.trim() === b.description.trim() &&
    (a.badge || '') === (b.badge || '') &&
    a.published === b.published &&
    JSON.stringify(a.images) === JSON.stringify(b.images) &&
    JSON.stringify(a.sizes) === JSON.stringify(b.sizes) &&
    JSON.stringify(a.colors) === JSON.stringify(b.colors) &&
    JSON.stringify(a.tags) === JSON.stringify(b.tags)
  );
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 transition-all duration-200">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-300">{label}</span>
      {children}
      {error ? (
        <span className="text-[11px] font-medium text-red-500 dark:text-red-400 animate-fadeIn">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-ink-400 dark:text-ink-400 leading-normal">{hint}</span>
      ) : null}
    </div>
  );
}

const getInputCls = (hasError?: boolean) =>
  `w-full rounded-xl border ${
    hasError
      ? 'border-red-500 dark:border-red-500/80 ring-2 ring-red-500/20'
      : 'border-black/10 dark:border-white/15 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30'
  } bg-white/70 dark:bg-ink-800/70 px-4 py-2.5 text-sm outline-none transition-all duration-200 dark:text-white`;

const validateImage = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 1. Reject empty files
    if (file.size === 0) {
      reject(new Error(`The file "${file.name}" is empty (0 bytes).`));
      return;
    }

    // 2. Format validation (Extensions & MIME Types)
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'heic', 'heif'];
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/heic',
      'image/heif',
      'image/heic-sequence',
      'image/heif-sequence'
    ];

    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isValidExt && !isValidMime) {
      reject(new Error(`The file "${file.name}" is in an unsupported format. Supported formats: JPG, JPEG, PNG, WEBP, AVIF, GIF, HEIC, HEIF.`));
      return;
    }

    // 3. File header signature check to verify that file is not a renamed non-image file
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      if (arr.length < 4) {
        reject(new Error(`The file "${file.name}" is too small or corrupted.`));
        return;
      }

      // JPEG/Ultra HDR: FF D8
      const isJpeg = arr[0] === 0xFF && arr[1] === 0xD8;
      // PNG: 89 50 4E 47
      const isPng = arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47;
      // GIF: 47 49 46 38 ('GIF8')
      const isGif = arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x38;
      // WEBP: RIFF (52 49 46 46) and WEBP (57 45 42 50)
      const isWebp = arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
                     arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50;
      // ISOBMFF ftyp check (AVIF, HEIC, HEIF)
      const isIsoBmff = arr.length >= 8 &&
                        arr[4] === 0x66 && arr[5] === 0x74 && arr[6] === 0x79 && arr[7] === 0x70;

      if (!isJpeg && !isPng && !isGif && !isWebp && !isIsoBmff) {
        reject(new Error(`The file "${file.name}" does not appear to be a valid image file (signature mismatch).`));
        return;
      }

      const nonRenderableInSomeBrowsers = ['heic', 'heif'];
      if (nonRenderableInSomeBrowsers.includes(ext) || typeof window.URL === 'undefined') {
        resolve();
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`The image file "${file.name}" is corrupted and cannot be displayed.`));
      };
      img.src = url;
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read "${file.name}".`));
    };

    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

export function ProductForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ProductInput;
  onSave: (input: ProductInput) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const { toast } = useStore();
  const [form, setForm] = useState<ProductInput>(initial ?? EMPTY);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);

  // Custom Attribute States
  const [newSize, setNewSize] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4AF37');
  const [hexInput, setHexInput] = useState('#D4AF37');
  const [hexError, setHexError] = useState('');
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [modalHex, setModalHex] = useState('#D4AF37');
  const [modalName, setModalName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevInitialRef = useRef<string>('');

  useEffect(() => {
    const currentSerialized = JSON.stringify(initial ?? EMPTY);
    if (prevInitialRef.current !== currentSerialized) {
      setForm(initial ?? EMPTY);
      setFieldErrors({});
      setError('');
      prevInitialRef.current = currentSerialized;
    }
  }, [initial]);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    setError('');

    setForm((f) => {
      const next = { ...f, [key]: value };

      // Pricing Sync Logic
      if (key === 'price' || key === 'originalPrice' || key === 'discountPercent' || key === 'isOnSale') {
        if (next.isOnSale) {
          const regPrice = next.originalPrice || next.price || 1000;
          if (key === 'discountPercent') {
            next.price = Math.round(regPrice * (1 - next.discountPercent / 100));
          } else if (key === 'price') {
            next.discountPercent = regPrice > next.price 
              ? Math.round(((regPrice - next.price) / regPrice) * 100)
              : 0;
          } else if (key === 'originalPrice') {
            const op = next.originalPrice || next.price;
            next.discountPercent = op > next.price 
              ? Math.round(((op - next.price) / op) * 100)
              : 0;
          }
        } else {
          if (key === 'isOnSale') {
            next.price = f.originalPrice || f.price;
            next.originalPrice = undefined;
            next.discountPercent = 0;
          }
        }
      }

      // Stock and InStock Sync Logic
      if (key === 'stock') {
        next.inStock = next.stock > 0;
      } else if (key === 'inStock') {
        if (!next.inStock) {
          next.stock = 0;
        } else if (next.stock <= 0) {
          next.stock = 10;
        }
      }

      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (form.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (form.isOnSale && form.originalPrice && form.originalPrice <= form.price) {
      errors.originalPrice = 'Regular price must be greater than sale price';
    }
    if (form.images.length === 0) {
      errors.images = 'Please add at least one product image';
    }
    if (!form.description.trim()) {
      errors.description = 'Product description is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please fix the highlighted errors above.');
      return;
    }

    // Check if initial was provided and no changes were made
    if (initial && isProductInputEqual(form, initial)) {
      setError('');
      toast('ℹ️ No changes to save.');
      return;
    }

    setError('');
    onSave(form);
  };

  // Image Gallery Helpers
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    update('images', [...form.images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const deleteImage = (index: number) => {
    update('images', form.images.filter((_, i) => i !== index));
  };

  const makePrimaryImage = (index: number) => {
    const next = [...form.images];
    const [img] = next.splice(index, 1);
    next.unshift(img);
    update('images', next);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileList = Array.from(files);
    setError('');
    setUploadingImages(true);

    try {
      await Promise.all(fileList.map((file) => validateImage(file)));
    } catch (valErr: any) {
      setError(valErr.message || 'Image validation failed.');
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (isMockAuth) {
      try {
        const base64List: string[] = [];
        for (const file of fileList) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const res = event.target?.result as string;
              if (res) resolve(res);
              else reject(new Error('Failed to read file content.'));
            };
            reader.onerror = () => reject(new Error('Failed to read file.'));
            reader.readAsDataURL(file);
          });
          base64List.push(base64);
        }
        setForm((f) => ({ ...f, images: [...f.images, ...base64List] }));
      } catch (err: any) {
        console.error('Failed to process image(s) in Demo Mode:', err);
        setError(`Failed to process image(s): ${err.message || err}`);
      } finally {
        setUploadingImages(false);
      }
    } else {
      if (!storage) {
        setError('Firebase Storage is not initialized');
        setUploadingImages(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      try {
        const uploadedUrls: string[] = [];
        for (const file of fileList) {
          const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const storageRef = ref(storage, `products/${filename}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedUrls.push(url);
        }
        setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
      } catch (err: any) {
        console.error('Failed to upload image(s):', err);
        setError(`Failed to upload image(s): ${err.message || err}`);
      } finally {
        setUploadingImages(false);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sizes Helpers
  const addSize = () => {
    const sz = newSize.trim().toUpperCase();
    if (!sz || form.sizes.includes(sz)) return;
    update('sizes', [...form.sizes, sz]);
    setNewSize('');
  };

  const removeSize = (sz: string) => {
    update('sizes', form.sizes.filter((x) => x !== sz));
  };

  // Colors Helpers
  const PRESET_SWATCHES = [
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Onyx Black', hex: '#111827' },
    { name: 'Ivory White', hex: '#FFFFF0' },
    { name: 'Navy Blue', hex: '#00022E' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Ruby Red', hex: '#E11D48' },
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Champagne', hex: '#F7E7CE' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Sapphire', hex: '#1E40AF' },
    { name: 'Bronze', hex: '#CD7F32' },
    { name: 'Platinum', hex: '#E5E4E2' },
    { name: 'Pearl', hex: '#E8E2D5' },
    { name: 'Slate Gray', hex: '#475569' },
    { name: 'Terracotta', hex: '#E07A5F' },
    { name: 'Mint Green', hex: '#A8E6CF' },
  ];

  const hexToRgb = (hex: string): string => {
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return 'rgb(0, 0, 0)';
    const num = parseInt(clean, 16);
    if (isNaN(num)) return 'rgb(0, 0, 0)';
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const openColorModal = () => {
    setModalHex(newColorHex || '#D4AF37');
    setModalName(newColorName);
    setColorModalOpen(true);
  };

  const applyModalColor = () => {
    const formatted = modalHex.toUpperCase();
    setNewColorHex(formatted);
    setHexInput(formatted);
    if (modalName.trim()) {
      setNewColorName(modalName.trim());
    }
    setHexError('');
    setColorModalOpen(false);
  };

  const isValidHex = (val: string) => /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val.trim());

  const normalizeHex = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    if (clean.length === 4) {
      clean = '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
    }
    return clean.toUpperCase();
  };

  const handlePickerChange = (val: string) => {
    const formatted = val.toUpperCase();
    setNewColorHex(formatted);
    setHexInput(formatted);
    setHexError('');
  };

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    const trimmed = val.trim();
    if (isValidHex(trimmed)) {
      const fullHex = normalizeHex(trimmed);
      setNewColorHex(fullHex);
      setHexError('');
    } else {
      setHexError('');
    }
  };

  const addColor = () => {
    if (hexError || !isValidHex(hexInput)) {
      setHexError('Invalid HEX code (e.g. #003465 or #036)');
      return;
    }
    const hex = normalizeHex(hexInput);
    const name = newColorName.trim() || hex;

    if (form.colors.some((c) => c.name.toLowerCase() === name.toLowerCase() || c.hex.toUpperCase() === hex.toUpperCase())) {
      setHexError('Color already added');
      return;
    }

    update('colors', [...form.colors, { name, hex }]);
    setNewColorName('');
    setNewColorHex('#D4AF37');
    setHexInput('#D4AF37');
    setHexError('');
  };

  const removeColor = (name: string) => {
    update('colors', form.colors.filter((x) => x.name !== name));
  };

  // Tags Helper
  const toggleTag = (tag: string) => {
    if (form.tags.includes(tag)) {
      update('tags', form.tags.filter((t) => t !== tag));
    } else {
      update('tags', [...form.tags, tag]);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* SECTION 1: BASIC INFORMATION */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 border-b border-black/5 dark:border-white/10 pb-2">Basic Details</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Name" error={fieldErrors.name}>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Midnight Tailored Blazer"
              className={getInputCls(!!fieldErrors.name)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value as Category)} className={getInputCls()}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => update('gender', e.target.value as 'men' | 'women' | 'unisex')} className={getInputCls()}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 items-center">
          <Field label="Custom Badge" hint="Optional overlay badge (e.g. 'Limited', 'Sold Out')">
            <input
              value={form.badge || ''}
              onChange={(e) => update('badge', e.target.value)}
              placeholder="e.g. Best Seller, Handcrafted"
              className={getInputCls()}
            />
          </Field>
          
          <div className="flex items-center gap-6 pt-5">
            <button
              type="button"
              onClick={() => update('published', !form.published)}
              className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 flex-1 ${
                form.published
                  ? 'border-gold-400 bg-gold-400/10 text-ink-900 dark:text-white'
                  : 'border-black/10 dark:border-white/15 text-ink-500 dark:text-ink-300 hover:border-gold-400/50'
              }`}
            >
              <span className="flex items-center gap-2">
                {form.published ? <Eye size={16} /> : <EyeOff size={16} />}
                {form.published ? 'Published (Visible)' : 'Hidden (Draft)'}
              </span>
              <span
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                  form.published ? 'bg-gold-400' : 'bg-black/10 dark:bg-white/15'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.published ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: PRICING & INVENTORY */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 border-b border-black/5 dark:border-white/10 pb-2">Pricing & Inventory</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => update('isOnSale', !form.isOnSale)}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
              form.isOnSale
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-black/10 dark:border-white/15 text-ink-500 hover:border-emerald-500/50'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${form.isOnSale ? 'bg-emerald-500' : 'bg-ink-400'}`} />
            {form.isOnSale ? 'On Sale: YES' : 'On Sale: NO'}
          </button>

          <button
            type="button"
            onClick={() => update('inStock', !form.inStock)}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
              form.inStock
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${form.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {form.inStock ? 'In Stock (Available)' : 'Out of Stock (Disabled)'}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          {form.isOnSale ? (
            <>
              <Field label="Regular Price (৳)" error={fieldErrors.originalPrice}>
                <input
                  type="number"
                  min={0}
                  value={form.originalPrice || ''}
                  onChange={(e) => update('originalPrice', Number(e.target.value))}
                  placeholder="Regular Price"
                  className={getInputCls(!!fieldErrors.originalPrice)}
                />
              </Field>
              <Field label="Sale Price (৳)" error={fieldErrors.price}>
                <input
                  type="number"
                  min={0}
                  value={form.price || ''}
                  onChange={(e) => update('price', Number(e.target.value))}
                  placeholder="Sale Price"
                  className={getInputCls(!!fieldErrors.price)}
                />
              </Field>
              <Field label="Discount %" hint="Auto-computed or set manually">
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={form.discountPercent || 0}
                  onChange={(e) => update('discountPercent', Number(e.target.value))}
                  className={getInputCls()}
                />
              </Field>
            </>
          ) : (
            <Field label="Regular Price (৳)" error={fieldErrors.price}>
              <input
                type="number"
                min={0}
                value={form.price || ''}
                onChange={(e) => update('price', Number(e.target.value))}
                className={getInputCls(!!fieldErrors.price)}
              />
            </Field>
          )}

          <Field label="Stock Quantity" hint="Setting stock to 0 sets Out of Stock">
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => update('stock', Number(e.target.value))}
              className={getInputCls()}
            />
          </Field>
        </div>
      </div>

      {/* SECTION 3: IMAGE GALLERY */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Product Images</h3>
          <span className="text-xs text-ink-400">First image will be used as the primary thumbnail.</span>
        </div>

        {fieldErrors.images && (
          <div className="text-xs font-medium text-red-500 dark:text-red-400 animate-fadeIn">
            {fieldErrors.images}
          </div>
        )}

        {form.images.length > 0 && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {form.images.map((src, index) => (
              <div key={index} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-black/10 dark:border-white/15 bg-ink-50 dark:bg-ink-900 transition-all duration-200">
                <img src={src} alt={`Product ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Image labels */}
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-md bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink-900 shadow-sm z-10">Primary</span>
                )}

                {/* Quick actions overlay */}
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => makePrimaryImage(index)}
                      className="rounded-lg bg-white/90 dark:bg-ink-900/90 px-2 py-1 text-[10px] font-bold text-ink-900 dark:text-white hover:bg-gold-400 dark:hover:bg-gold-400 hover:text-black transition-colors"
                    >
                      Make Primary
                    </button>
                  ) : <div />}
                  <button
                    type="button"
                    onClick={() => deleteImage(index)}
                    className="rounded-lg bg-red-600/95 p-1.5 text-white hover:bg-red-700 transition-colors"
                    aria-label="Delete image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Add Image URL */}
          <div className="flex gap-2">
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste a hosted image URL (https://images.pexels.com/...)"
              className={`${getInputCls()} text-xs`}
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 rounded-xl border border-black/10 dark:border-white/15 hover:border-gold-400 dark:hover:border-gold-400 transition-all font-semibold text-sm flex items-center gap-1.5 whitespace-nowrap dark:text-white"
            >
              <Plus size={15} /> Add URL
            </button>
          </div>

          {/* Upload Image local file */}
          <div className="flex items-center justify-center border-2 border-dashed border-black/10 dark:border-white/15 rounded-xl p-4 hover:border-gold-400 transition-all">
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <Upload size={20} className="text-gold-500" />
              <span className="text-xs font-semibold text-ink-700 dark:text-ink-200">Upload Image Files</span>
              <span className="text-[10px] text-ink-400">
                {isMockAuth ? 'Supports JPG, PNG, WEBP, AVIF, HEIC, Ultra HDR (Base64 saved locally)' : 'Supports JPG, PNG, WEBP, AVIF, HEIC, Ultra HDR (Uploaded to Firebase Storage)'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadingImages || saving}
              />
            </label>
          </div>

          {uploadingImages && (
            <div className="flex items-center justify-center gap-2 text-gold-500 font-semibold text-xs py-2 animate-fadeIn">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-gold-500 border-t-transparent" />
              <span>Uploading image...</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: SIZES & COLORS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* SIZES */}
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Available Sizes</h3>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">Quick templates:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => update('sizes', SIZES_CLOTHING)}
                className="rounded-lg bg-black/5 dark:bg-white/5 hover:bg-gold-400/20 px-2.5 py-1 text-[10px] font-bold text-ink-700 dark:text-ink-200 transition-colors"
              >
                Clothing (XS-XXL)
              </button>
              <button
                type="button"
                onClick={() => update('sizes', SIZES_SHOES)}
                className="rounded-lg bg-black/5 dark:bg-white/5 hover:bg-gold-400/20 px-2.5 py-1 text-[10px] font-bold text-ink-700 dark:text-ink-200 transition-colors"
              >
                Shoes (40-45)
              </button>
              <button
                type="button"
                onClick={() => update('sizes', [])}
                className="rounded-lg bg-red-600/10 hover:bg-red-600/20 px-2.5 py-1 text-[10px] font-bold text-red-600 transition-colors"
              >
                Clear Sizes
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 min-h-[44px] items-center">
            {form.sizes.length === 0 ? (
              <span className="text-xs text-ink-400 px-2">No sizes specified (one size/universal)</span>
            ) : (
              form.sizes.map((sz) => (
                <span key={sz} className="inline-flex items-center gap-1 rounded bg-white dark:bg-ink-800 border border-black/10 dark:border-white/15 px-2 py-0.5 text-xs font-bold dark:text-white transition-all">
                  {sz}
                  <button type="button" onClick={() => removeSize(sz)} className="text-red-500 hover:text-red-700 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add Custom Size (e.g., M, XL, 38)"
              className={`${getInputCls()} text-xs`}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(); } }}
            />
            <button
              type="button"
              onClick={addSize}
              className="px-3 rounded-xl border border-black/10 dark:border-white/15 hover:border-gold-400 dark:hover:border-gold-400 text-sm font-semibold whitespace-nowrap dark:text-white transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* COLORS */}
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Product Colors</h3>
          </div>

          <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 min-h-[44px] items-center">
            {form.colors.length === 0 ? (
              <span className="text-xs text-ink-400 px-2">No colors specified</span>
            ) : (
              form.colors.map((c) => (
                <span key={c.name} className="inline-flex items-center gap-1.5 rounded bg-white dark:bg-ink-800 border border-black/10 dark:border-white/15 px-2.5 py-1 text-xs font-semibold dark:text-white transition-all">
                  <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button type="button" onClick={() => removeColor(c.name)} className="text-red-500 hover:text-red-700 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">Add custom color:</span>
            <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color Name (e.g. Amber)"
                className={`${getInputCls()} text-xs flex-1`}
              />
              <div className="flex items-center gap-1.5 px-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-ink-800">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => handlePickerChange(e.target.value)}
                  className="h-7 w-7 border-0 rounded cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="#003465"
                  maxLength={7}
                  className="w-20 bg-transparent text-xs font-mono uppercase focus:outline-none dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={openColorModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 hover:border-gold-400 dark:hover:border-gold-400 bg-white dark:bg-ink-800 text-xs font-semibold text-ink-700 dark:text-ink-200 transition-all active:scale-95 shrink-0"
                title="Open Color Palette Modal"
              >
                <Palette size={14} className="text-gold-500" />
                <span className="hidden sm:inline">Palette</span>
              </button>
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 hover:border-gold-400 dark:hover:border-gold-400 text-xs font-semibold dark:text-white transition-all shrink-0"
              >
                Add
              </button>
            </div>
            {hexError && (
              <span className="text-[11px] font-medium text-red-500 dark:text-red-400 block pl-1 animate-fadeIn">
                {hexError}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 5: TAGS & BADGES (FEATURED/TRENDING/NEW/BEST SELLER) */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 border-b border-black/5 dark:border-white/10 pb-2">Status & Tags</h3>
        
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
          {[
            { tag: 'trending', label: 'Featured / Trending' },
            { tag: 'new', label: 'New Arrival' },
            { tag: 'bestseller', label: 'Best Seller' },
            { tag: 'limited', label: 'Limited Edition' },
            { tag: 'flash', label: 'Flash Sale' },
          ].map((item) => {
            const active = form.tags.includes(item.tag);
            return (
              <button
                key={item.tag}
                type="button"
                onClick={() => toggleTag(item.tag)}
                className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all duration-200 ${
                  active
                    ? 'border-gold-400 bg-gold-400/10 text-ink-900 dark:text-white shadow-sm'
                    : 'border-black/10 dark:border-white/15 text-ink-500 hover:border-gold-400/40 hover:bg-black/[0.02]'
                }`}
              >
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[9px] text-gold-600 dark:text-gold-400 font-mono mt-1">tag: {item.tag}</span>
                {active && <Check size={14} className="text-gold-500 mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: DESCRIPTION */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 border-b border-black/5 dark:border-white/10 pb-2">Description</h3>
        <Field label="Short & Premium Product Description" error={fieldErrors.description}>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            placeholder="Describe the silhouette, tailoring, luxury materials, fit advice..."
            className={`${getInputCls(!!fieldErrors.description)} resize-none`}
          />
        </Field>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300 animate-fadeIn">
          {error}
        </div>
      )}

      {/* FOOTER BUTTONS */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/5 dark:border-white/10 pt-5">
        <button type="button" onClick={onCancel} disabled={saving} className="btn-ghost disabled:opacity-50">
          <X size={16} /> Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploadingImages}
          className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
        >
          {saving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-ink-900 border-t-transparent rounded-full" />
              <span>Saving...</span>
            </>
          ) : uploadingImages ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-ink-900 border-t-transparent rounded-full" />
              <span>Uploading image...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Product</span>
            </>
          )}
        </button>
      </div>

      {/* COLOR SELECTION MODAL */}
      {colorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-[20px] bg-white dark:bg-ink-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl shadow-black/20 dark:shadow-gold-500/5 space-y-5 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                  <Palette size={18} className="text-gold-500" /> Choose Color
                </h3>
                <p className="text-xs text-ink-400 mt-0.5">Select a luxury preset or customize your hue</p>
              </div>
              <button
                type="button"
                onClick={() => setColorModalOpen(false)}
                className="rounded-xl p-1.5 text-ink-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Color Swatch Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 block">
                Preset Palette
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto p-1 custom-scrollbar">
                {PRESET_SWATCHES.map((swatch) => {
                  const isSelected = modalHex.toUpperCase() === swatch.hex.toUpperCase();
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => {
                        setModalHex(swatch.hex.toUpperCase());
                        setModalName(swatch.name);
                      }}
                      title={`${swatch.name} (${swatch.hex})`}
                      className={`group relative h-9 w-9 rounded-xl border border-black/10 dark:border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm ${
                        isSelected
                          ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-white dark:ring-offset-ink-900 scale-105'
                          : 'hover:shadow-md'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className={
                            ['#FFFFF0', '#F7E7CE', '#E8E2D5', '#E5E4E2', '#A8E6CF'].includes(swatch.hex)
                              ? 'text-black'
                              : 'text-white'
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Picker Controls */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 block">
                Custom Color Picker
              </span>
              <div className="flex gap-2 items-center">
                <div className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5">
                  <input
                    type="color"
                    value={modalHex}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setModalHex(val);
                      const match = PRESET_SWATCHES.find((s) => s.hex.toUpperCase() === val);
                      if (match) setModalName(match.name);
                    }}
                    className="h-6 w-6 rounded border-0 cursor-pointer bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={modalHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalHex(val);
                      if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val.trim())) {
                        let clean = val.trim();
                        if (!clean.startsWith('#')) clean = '#' + clean;
                        if (clean.length === 4) {
                          clean = '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
                        }
                        const match = PRESET_SWATCHES.find((s) => s.hex.toUpperCase() === clean.toUpperCase());
                        if (match) setModalName(match.name);
                      }
                    }}
                    placeholder="#003465"
                    maxLength={7}
                    className="w-20 bg-transparent text-xs font-mono uppercase focus:outline-none dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Color Name (optional)"
                  className={`${getInputCls()} text-xs flex-1`}
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 flex items-center gap-3.5">
              <div
                className="h-12 w-12 rounded-xl border border-black/10 dark:border-white/20 shadow-inner shrink-0 transition-all duration-300"
                style={{ backgroundColor: modalHex }}
              />
              <div className="space-y-0.5 overflow-hidden">
                <div className="text-xs font-bold text-ink-900 dark:text-white truncate">
                  {modalName.trim() || PRESET_SWATCHES.find((s) => s.hex.toUpperCase() === modalHex.toUpperCase())?.name || 'Custom Color'}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="font-semibold text-gold-600 dark:text-gold-400 uppercase">
                    {modalHex}
                  </span>
                  <span className="text-ink-400">•</span>
                  <span className="text-ink-500 dark:text-ink-400">{hexToRgb(modalHex)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setColorModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-ink-600 dark:text-ink-300 transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyModalColor}
                className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-500 text-ink-950 text-xs font-bold shadow-md shadow-gold-400/20 transition-all duration-200 active:scale-95"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

