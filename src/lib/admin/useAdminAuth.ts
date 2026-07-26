import { useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { useAuth } from '../authContext';
import { auth } from '../firebase';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s: string) => s.trim().toLowerCase())
  .filter(Boolean);

export function useAdminAuth() {
  const { user, ready, configured, logout, isMock } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (!ready) {
      setCheckingAdmin(true);
      return;
    }

    if (isMock) {
      if (!configured || !user) {
        setIsAdmin(false);
      } else {
        const userEmail = (user.email ?? '').toLowerCase();
        if (ADMIN_EMAILS.length > 0) {
          setIsAdmin(ADMIN_EMAILS.includes(userEmail));
        } else {
          setIsAdmin(userEmail === 'admin@crazyfeb.com');
        }
      }
      setCheckingAdmin(false);
      return;
    }

    if (!configured || !auth || !user) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    setCheckingAdmin(true);
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }
      try {
        const idTokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
      } catch (err) {
        console.error('Error checking admin claim:', err);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [configured, isMock, ready, user]);

  return { user, ready, configured, isAdmin, checkingAdmin, logout };
}

