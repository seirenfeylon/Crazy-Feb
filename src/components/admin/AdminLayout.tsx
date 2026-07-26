import { useState } from 'react';
import type { AdminSection } from '../../types';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAdminAuth } from '../../lib/admin/useAdminAuth';
import { useStore } from '../../store';

export function AdminLayout({
  section,
  onNavigate,
  children,
}: {
  section: AdminSection;
  onNavigate: (s: AdminSection) => void;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const { navigate } = useStore();

  const handleLogout = async () => {
    await logout();
    navigate({ name: 'home' });
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <div className="flex">
        <Sidebar
          active={section}
          onNavigate={(s) => {
            onNavigate(s);
            setMobileOpen(false);
          }}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <Topbar section={section} user={user} onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div key={section} className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
