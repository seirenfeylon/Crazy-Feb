import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, LogOut, X, Mail } from 'lucide-react';
import type { AdminSection } from '../../types';

const NAV: { id: AdminSection; label: string; icon: React.ReactNode; placeholder?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'products', label: 'Products', icon: <Package size={18} /> },
  { id: 'categories', label: 'Categories', icon: <FolderTree size={18} /> },
  { id: 'messages', label: 'Messages', icon: <Mail size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} />, placeholder: true },
  { id: 'customers', label: 'Customers', icon: <Users size={18} />, placeholder: true },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export function Sidebar({
  active,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: {
  active: AdminSection;
  onNavigate: (s: AdminSection) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-black/5 dark:border-white/10 bg-white dark:bg-ink-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/5 dark:border-white/10 px-6">
          <div className="flex items-center gap-2.5">
            <img src="/branding/icon.svg" alt="CrazyFeb" className="h-8 w-8" />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold tracking-tight">CrazyFeb</span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-gold-500 dark:text-gold-300">Admin</span>
            </div>
          </div>
          <button onClick={onCloseMobile} className="rounded-lg p-1.5 text-ink-500 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900 shadow-soft'
                        : 'text-ink-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className={isActive ? 'text-gold-400 dark:text-gold-500' : 'text-gold-500 dark:text-gold-300'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.placeholder && (
                      <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-400">
                        Soon
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-black/5 dark:border-white/10 p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
