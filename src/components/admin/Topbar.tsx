import { Menu, Search } from 'lucide-react';
import type { User } from 'firebase/auth';

const TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  messages: 'Messages',
  orders: 'Orders',
  customers: 'Customers',
  settings: 'Settings',
};

export function Topbar({
  section,
  user,
  onOpenMobile,
}: {
  section: string;
  user: User | null;
  onOpenMobile: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-ink-900/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-ink-600 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <h1 className="font-display text-lg font-bold tracking-tight sm:text-xl">{TITLES[section] ?? 'Dashboard'}</h1>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-ink-800/70 px-3 py-2 text-sm text-ink-400 sm:flex">
        <Search size={15} />
        <span className="text-xs">Search…</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-xs font-bold text-gold-400 dark:bg-white dark:text-ink-900">
            {(user?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold">{user?.displayName || 'Admin'}</span>
            <span className="text-[10px] text-ink-500 dark:text-ink-300">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
