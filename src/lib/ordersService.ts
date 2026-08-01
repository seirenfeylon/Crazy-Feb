import { db, isMockAuth } from './firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import type { Order } from '../types';

const LOCAL_STORAGE_KEY = 'crazyfeb-orders';

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('parvej-orders');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse orders from localStorage', e);
    }
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  localStorage.removeItem('parvej-orders');
  window.dispatchEvent(new Event('crazyfeb_orders_updated'));
}

export const ordersService = {
  async createOrder(input: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const createdAt = new Date().toISOString();
    const status: Order['status'] = 'pending';

    if (!isMockAuth && db) {
      const orderPayload = {
        items: input.items,
        customerInfo: input.customerInfo,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        discount: input.discount,
        shipping: input.shipping,
        total: input.total,
        status,
        createdAt,
      };

      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      const newOrder: Order = {
        id: docRef.id,
        ...orderPayload,
      };
      return newOrder;
    } else {
      const mockId = `CF-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: mockId,
        items: input.items,
        customerInfo: input.customerInfo,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        discount: input.discount,
        shipping: input.shipping,
        total: input.total,
        status,
        createdAt,
      };
      const current = getLocalOrders();
      current.unshift(newOrder);
      saveLocalOrders(current);
      return newOrder;
    }
  },

  async getOrders(): Promise<Order[]> {
    if (!isMockAuth && db) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>),
      }));
    } else {
      return getLocalOrders();
    }
  },

  subscribe(onUpdate: (orders: Order[]) => void): () => void {
    if (!isMockAuth && db) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Order, 'id'>),
          }));
          onUpdate(list);
        },
        (error) => {
          console.warn('Firestore orders subscription failed, falling back to local orders:', error);
          onUpdate(getLocalOrders());
        }
      );
    } else {
      onUpdate(getLocalOrders());
      const handleCustomEvent = () => onUpdate(getLocalOrders());
      window.addEventListener('crazyfeb_orders_updated', handleCustomEvent);
      window.addEventListener('storage', handleCustomEvent);
      return () => {
        window.removeEventListener('crazyfeb_orders_updated', handleCustomEvent);
        window.removeEventListener('storage', handleCustomEvent);
      };
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    if (!isMockAuth && db) {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, { status });
    } else {
      const current = getLocalOrders();
      const updated = current.map((ord) => (ord.id === id ? { ...ord, status } : ord));
      saveLocalOrders(updated);
    }
  },

  async deleteOrder(id: string): Promise<void> {
    if (!isMockAuth && db) {
      await deleteDoc(doc(db, 'orders', id));
    } else {
      const current = getLocalOrders();
      const updated = current.filter((ord) => ord.id !== id);
      saveLocalOrders(updated);
    }
  },
};
