import { db, isMockAuth } from './firebase';
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import type { ContactMessage } from '../types';

const LOCAL_STORAGE_KEY = 'crazyfeb-messages';

// Get fallback messages from localStorage
function getLocalMessages(): ContactMessage[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('parvej-messages');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      localStorage.setItem(LOCAL_STORAGE_KEY, saved);
      localStorage.removeItem('parvej-messages');
      return parsed;
    } catch (e) {
      console.error('Failed to parse messages from localStorage', e);
    }
  }
  return [];
}

// Save messages to localStorage
function saveLocalMessages(messages: ContactMessage[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  // Dispatch custom event for real-time local sync across tabs/components in the same session
  window.dispatchEvent(new Event('crazyfeb_messages_updated'));
}

export const messagesService = {
  // Send a message
  async sendMessage(input: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      ...input,
      id: isMockAuth ? `msg_${Date.now()}` : '', // Firestore will assign its own ID
      createdAt: new Date().toISOString(),
      read: false,
    };

    if (!isMockAuth && db) {
      // Real Firebase Backend
      const docRef = await addDoc(collection(db, 'messages'), {
        firstName: newMessage.firstName,
        lastName: newMessage.lastName,
        email: newMessage.email,
        orderNumber: newMessage.orderNumber || '',
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        read: newMessage.read,
      });
      newMessage.id = docRef.id;
      return newMessage;
    } else {
      // Demo Mode / localStorage fallback
      const current = getLocalMessages();
      current.unshift(newMessage); // latest first
      saveLocalMessages(current);
      return newMessage;
    }
  },

  // Mark a message as read/unread
  async markAsRead(id: string, read: boolean): Promise<void> {
    if (!isMockAuth && db) {
      const docRef = doc(db, 'messages', id);
      await updateDoc(docRef, { read });
    } else {
      const current = getLocalMessages();
      const updated = current.map((msg) =>
        msg.id === id ? { ...msg, read } : msg
      );
      saveLocalMessages(updated);
    }
  },

  // Delete a message
  async deleteMessage(id: string): Promise<void> {
    if (!isMockAuth && db) {
      await deleteDoc(doc(db, 'messages', id));
    } else {
      const current = getLocalMessages();
      const updated = current.filter((msg) => msg.id !== id);
      saveLocalMessages(updated);
    }
  },

  // Subscribe to real-time updates
  subscribe(onUpdate: (messages: ContactMessage[]) => void): () => void {
    if (!isMockAuth && db) {
      // Firestore Realtime Listener
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const list: ContactMessage[] = [];
          snapshot.forEach((docSnap) => {
            list.push({
              ...(docSnap.data() as Omit<ContactMessage, 'id'>),
              id: docSnap.id,
            });
          });
          onUpdate(list);
        },
        (error) => {
          console.error('Firestore messages subscription failed:', error);
        }
      );
    } else {
      // Demo Mode listener using window custom event + initial fetch
      onUpdate(getLocalMessages());

      const handleUpdate = () => {
        onUpdate(getLocalMessages());
      };

      window.addEventListener('crazyfeb_messages_updated', handleUpdate);
      return () => {
        window.removeEventListener('crazyfeb_messages_updated', handleUpdate);
      };
    }
  },
};
