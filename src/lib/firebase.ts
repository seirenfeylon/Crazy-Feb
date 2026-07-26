import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const isPlaceholder = (val?: string): boolean => {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.includes('placeholder') ||
    lower.includes('your_') ||
    lower.includes('mock') ||
    val.trim() === '' ||
    val.trim() === 'undefined'
  );
};

const isMockAuth: boolean =
  import.meta.env.VITE_FORCE_MOCK_MODE === 'true' ||
  isPlaceholder(firebaseConfig.apiKey) ||
  isPlaceholder(firebaseConfig.authDomain) ||
  isPlaceholder(firebaseConfig.projectId) ||
  isPlaceholder(firebaseConfig.appId);

const hasConfig: boolean =
  (!isPlaceholder(firebaseConfig.apiKey) &&
    !isPlaceholder(firebaseConfig.projectId)) ||
  isMockAuth;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!isMockAuth) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Failed to initialize real Firebase, falling back to mock auth:', error);
  }
}

export { app, auth, db, storage, hasConfig, isMockAuth };
