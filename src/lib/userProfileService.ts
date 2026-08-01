import type { UserBodyProfile } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'crazyfeb_user_body_profile';

export async function getUserBodyProfile(userId?: string | null): Promise<UserBodyProfile | null> {
  // Try local storage first for guest / immediate availability
  let localData: UserBodyProfile | null = null;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      localData = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse local body profile', e);
    }
  }

  // If logged in and Firestore db exists, try fetching remote profile
  if (userId && db) {
    try {
      const userRef = doc(db, 'user_profiles', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const remoteData = snap.data().bodyProfile as UserBodyProfile;
        if (remoteData) {
          // Sync to localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData));
          return remoteData;
        }
      }
    } catch (e) {
      console.error('Failed to fetch user body profile from Firestore', e);
    }
  }

  return localData;
}

export async function saveUserBodyProfile(profile: UserBodyProfile, userId?: string | null): Promise<void> {
  const updatedProfile: UserBodyProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  // Always save locally
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));

  // Save to Firestore if logged in
  if (userId && db) {
    try {
      const userRef = doc(db, 'user_profiles', userId);
      await setDoc(userRef, { bodyProfile: updatedProfile }, { merge: true });
    } catch (e) {
      console.error('Failed to save user body profile to Firestore', e);
    }
  }
}
