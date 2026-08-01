import type { Product, SizeChartEntry } from '../../types';
import { products as seedProducts } from '../../data/products';
import { db, isMockAuth } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

export type ProductInput = {
  name: string;
  category: Product['category'];
  gender: Product['gender'];
  price: number;
  originalPrice?: number;
  discountPercent: number;
  isOnSale: boolean;
  stock: number;
  inStock: boolean;
  images: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tags: string[];
  badge?: string;
  published: boolean;
  sizeChart?: SizeChartEntry[];
};

export type ProductListRow = {
  id: string;
  name: string;
  category: Product['category'];
  price: number;
  discountPercent: number;
  stock: number;
  image: string;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  published: boolean;
  brand?: string;
  description?: string;
  sku?: string;
};

export interface ProductsRepository {
  list(): Promise<ProductListRow[]>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
  get(id: string): Promise<Product | null>;
}

function toRow(p: Product): ProductListRow {
  const discountPercent =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;
  const stock = p.stock ?? 0;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    discountPercent,
    stock,
    image: p.images[0] ?? '',
    inStock: p.inStock,
    featured: p.tags.includes('trending'),
    isNew: p.tags.includes('new'),
    isBestSeller: p.tags.includes('bestseller'),
    published: p.published !== false,
    brand: p.brand,
    description: p.description,
    sku: p.sku || p.id,
  };
}

// Initialize stock and published status on the original seed list if not already done, so we mutate in-place.
seedProducts.forEach((p: Product) => {
  if (p.stock === undefined) {
    p.stock = Math.floor(Math.random() * 40) + 5;
  }
  if (p.published === undefined) {
    p.published = true;
  }
});

const memoryStore: Product[] = seedProducts;

function syncMemoryStore() {
  if (typeof window === 'undefined') return;
  const LOCAL_STORAGE_KEY = 'crazyfeb-products';
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        memoryStore.length = 0;
        memoryStore.push(...parsed);
      }
    } catch (e) {
      console.error('Failed to parse products from localStorage in productsService', e);
    }
  }
}

function nextId(): string {
  return `p${Date.now().toString(36)}${Math.floor(Math.random() * 1000).toString(36)}`;
}

export const memoryProductsRepository: ProductsRepository = {
  async list() {
    syncMemoryStore();
    return Promise.resolve(memoryStore.map(toRow));
  },
  async create(input) {
    syncMemoryStore();
    const id = nextId();
    const originalPrice = input.isOnSale && input.originalPrice ? input.originalPrice : undefined;
    
    const product: Product = {
      id,
      name: input.name,
      brand: 'CrazyFeb Atelier',
      category: input.category,
      gender: input.gender || 'unisex',
      price: input.price,
      originalPrice,
      rating: 5,
      reviewCount: 0,
      colors: input.colors || [],
      sizes: input.sizes || [],
      images: input.images || [],
      description: input.description || '',
      details: ['Premium quality material', 'Ethically crafted', 'Elegant fit'],
      tags: input.tags,
      badge: input.badge,
      inStock: input.inStock,
      stock: input.stock,
      published: input.published !== false,
      reviews: [],
    };
    delete (product as Partial<Product> & { image?: string }).image;
    
    memoryStore.push(product);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('crazyfeb-products', JSON.stringify(memoryStore));
    }
    
    return Promise.resolve(product);
  },
  async update(id, input) {
    syncMemoryStore();
    const idx = memoryStore.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Product not found');
    const existing = memoryStore[idx];
    
    const originalPrice = input.isOnSale && input.originalPrice ? input.originalPrice : undefined;
    
    const updated: Product = {
      ...existing,
      name: input.name,
      category: input.category,
      gender: input.gender,
      price: input.price,
      originalPrice,
      colors: input.colors,
      sizes: input.sizes,
      images: input.images,
      description: input.description,
      tags: input.tags,
      badge: input.badge,
      inStock: input.inStock,
      stock: input.stock,
      published: input.published !== false,
    };
    delete (updated as Partial<Product> & { image?: string }).image;
    
    memoryStore[idx] = updated;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('crazyfeb-products', JSON.stringify(memoryStore));
    }
    
    return Promise.resolve(updated);
  },
  async remove(id) {
    syncMemoryStore();
    const idx = memoryStore.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryStore.splice(idx, 1);
      if (typeof window !== 'undefined') {
        localStorage.setItem('crazyfeb-products', JSON.stringify(memoryStore));
      }
    }
    return Promise.resolve();
  },
  async get(id) {
    syncMemoryStore();
    const found = memoryStore.find((p) => p.id === id);
    return Promise.resolve(found ? found : null);
  },
};

export async function seedProductsToFirestore() {
  if (!db) return;
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.empty) {
      for (const p of seedProducts) {
        const productToSave = {
          ...p,
          stock: p.stock ?? Math.floor(Math.random() * 40) + 5,
          published: p.published !== false,
        };
        await setDoc(doc(db, 'products', p.id), productToSave);
      }
      console.log('Successfully seeded default products to Firestore.');
    }
  } catch (error) {
    console.error('Failed to seed default products to Firestore:', error);
  }
}

export const firestoreProductsRepository: ProductsRepository = {
  async list() {
    if (!db) throw new Error('Firestore is not initialized');
    await seedProductsToFirestore();
    const snapshot = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Product);
    });
    return list.map(toRow);
  },
  async create(input) {
    if (!db) throw new Error('Firestore is not initialized');
    const id = nextId();
    const originalPrice = input.isOnSale && input.originalPrice ? input.originalPrice : undefined;
    
    const product: Product = {
      id,
      name: input.name,
      brand: 'CrazyFeb Atelier',
      category: input.category,
      gender: input.gender || 'unisex',
      price: input.price,
      originalPrice,
      rating: 5,
      reviewCount: 0,
      colors: input.colors || [],
      sizes: input.sizes || [],
      images: input.images || [],
      description: input.description || '',
      details: ['Premium quality material', 'Ethically crafted', 'Elegant fit'],
      tags: input.tags,
      badge: input.badge,
      inStock: input.inStock,
      stock: input.stock,
      published: input.published !== false,
      reviews: [],
    };
    
    await setDoc(doc(db, 'products', id), product);
    return product;
  },
  async update(id, input) {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Product not found');
    const existing = docSnap.data() as Product;
    
    const originalPrice = input.isOnSale && input.originalPrice ? input.originalPrice : undefined;
    
    const updated: Product = {
      ...existing,
      name: input.name,
      category: input.category,
      gender: input.gender,
      price: input.price,
      originalPrice,
      colors: input.colors,
      sizes: input.sizes,
      images: input.images,
      description: input.description,
      tags: input.tags,
      badge: input.badge,
      inStock: input.inStock,
      stock: input.stock,
      published: input.published !== false,
    };
    
    await setDoc(docRef, updated);
    return updated;
  },
  async remove(id) {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'products', id));
  },
  async get(id) {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Product;
    }
    return null;
  },
};

export const productsRepository: ProductsRepository = isMockAuth ? memoryProductsRepository : firestoreProductsRepository;
