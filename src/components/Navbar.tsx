import { useEffect, useState } from 'react';
import { Heart, LogOut, Menu, Moon, Search, ShoppingBag, Shield, Sun, User, X } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';
import { useAdminAuth } from '../lib/admin/useAdminAuth';
import type { Route } from '../types';

const links: { label: string; route: Route }[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Shop', route: { name: 'shop' } },
  { label: 'Men', route: { name: 'shop', gender: 'men' } },
  { label: 'Women', route: { name: 'shop', gender: 'women' } },
  { label: 'Collections', route: { name: 'collections' } },
  { label: 'New Arrivals', route: { name: 'new-arrivals' } },
  { label: 'Best Sellers', route: { name: 'shop' } },
  { label: 'About', route: { name: 'about' } },
  { label: 'Contact', route: { name: 'contact' } },
];

export default function Navbar() {
  const { navigate, route, cartCount, setCartOpen, wishlist, theme, toggleTheme, setSearchOpen, toast, lang, setLang, t, siteSettings } = useStore();
  const { user, logout, ready } = useAuth();
  const { isAdmin, checkingAdmin } = useAdminAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (r: Route) => {
    if (r.name !== route.name) return false;
    if (r.name === 'shop' && route.name === 'shop') {
      return r.gender === route.gender;
    }
    return true;
  };

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      {siteSettings.flagShowAnnouncement && siteSettings.announcementEnable && (
        <div
          className="bg-ink-900 text-white"
          style={{
            backgroundColor: siteSettings.announcementBgColor || undefined,
            color: siteSettings.announcementTextColor || undefined,
          }}
        >
          <div className="overflow-hidden">
            <div
              className="marquee py-2 text-[11px] font-medium tracking-wider uppercase"
              style={{
                animationDuration: `${280 / (siteSettings.announcementScrollSpeed || 15)}s`,
                animationPlayState: siteSettings.announcementAutoScroll ? 'running' : 'paused',
                animation: siteSettings.announcementAutoScroll ? undefined : 'none',
              }}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} className="flex shrink-0">
                  {(siteSettings.announcementText || '')
                    .split(/[•|;]/)
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .map((item, idx) => (
                      <span key={idx} className="flex items-center">
                        <span className="px-6" style={{ color: siteSettings.announcementTextColor || undefined }}>{item}</span>
                        <span className="text-gold-300 shrink-0">•</span>
                      </span>
                    ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-lux flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2.5 transition-all duration-500 hover:scale-[1.02] hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
            <img src="/branding/icon.svg" alt="CrazyFeb" className="h-9 w-9 sm:hidden" />
            <img src="/branding/logo.svg" alt="CrazyFeb" className="hidden h-8 sm:block dark:hidden" />
            <img src="/branding/logo-white.svg" alt="CrazyFeb" className="hidden h-8 dark:sm:block" />
            <span className="font-display text-xl font-bold tracking-tight sm:hidden">CrazyFeb</span>
          </button>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-1">
            {links
              .filter((l) => ['Home', 'Shop', 'New Arrivals', 'About'].includes(l.label))
              .map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.route)}
                  className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive(l.route) ? 'text-gold-500' : 'text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-white'
                  }`}
                >
                  {t(l.label)}
                  {isActive(l.route) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-400" />
                  )}
                </button>
              ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              aria-label="Toggle language"
              className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-bold text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              title={lang === 'en' ? 'Switch to Bangla' : 'Switch to English'}
            >
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => go({ name: 'wishlist' })}
              aria-label="Wishlist"
              className="relative hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-900">
                  {wishlist.length}
                </span>
              )}
            </button>
            <div className="relative hidden sm:block">
              <button
                onClick={() => (ready && user ? setUserMenu((v) => !v) : go({ name: 'signin' }))}
                aria-label="Account"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : user ? (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-xs font-bold text-white dark:bg-white dark:text-ink-900">
                    {(user.displayName?.[0] || user.email?.[0] || 'P').toUpperCase()}
                  </span>
                ) : (
                  <User size={18} />
                )}
              </button>
              {userMenu && user && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl glass shadow-lift animate-scale-in">
                    <div className="border-b border-black/5 dark:border-white/10 p-4">
                      <div className="text-sm font-semibold">{user.displayName || 'CrazyFeb Member'}</div>
                      <div className="truncate text-xs text-ink-500">{user.email}</div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { go({ name: 'profile' }); setUserMenu(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                        <User size={15} /> {t('Profile')}
                      </button>
                      {!checkingAdmin && isAdmin && (
                        <button onClick={() => { go({ name: 'admin', section: 'dashboard' }); setUserMenu(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gold-600 dark:text-gold-400 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                          <Shield size={15} /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={() => { go({ name: 'wishlist' }); setUserMenu(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                        <Heart size={15} /> {t('Wishlist')}
                      </button>
                      <button onClick={async () => { await logout(); setUserMenu(false); toast('Signed out'); go({ name: 'home' }); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut size={15} /> {t('Logout')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink-900 dark:bg-white px-1 text-[10px] font-bold text-white dark:text-ink-900">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 xl:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm glass-strong shadow-lift border-l border-white/20 transition-transform duration-500 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg font-bold">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col px-3">
            {links
              .filter((l) => ['Home', 'Shop', 'New Arrivals', 'About'].includes(l.label))
              .map((l) => (
                <button
                  key={l.label}
                  onClick={() => go(l.route)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {t(l.label)}
                </button>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/5 dark:border-white/10 px-5 pt-4">
            <button onClick={() => go({ name: 'wishlist' })} className="btn-ghost flex-1">
              <Heart size={16} /> {t('Wishlist')}
            </button>
            <button onClick={() => go(user ? { name: 'profile' } : { name: 'signin' })} className="btn-ghost flex-1">
              <User size={16} /> {user ? t('Profile') : t('Sign In')}
            </button>
            {!checkingAdmin && isAdmin && (
              <button onClick={() => go({ name: 'admin', section: 'dashboard' })} className="btn-ghost flex-1 text-gold-600 dark:text-gold-400 font-semibold">
                <Shield size={16} /> Admin
              </button>
            )}
            <button onClick={toggleTheme} className="btn-ghost grid h-11 w-11 place-items-center">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="btn-ghost h-11 px-3 flex items-center justify-center text-xs font-bold"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'বাংলা' : 'ENGLISH'}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
