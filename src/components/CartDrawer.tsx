import { Minus, Plus, ShoppingBag, Tag, Trash2, X, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { formatBDT } from '../data/products';

const FREE_SHIP_THRESHOLD = 15000;

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeFromCart,
    cartSubtotal,
    navigate,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    t,
  } = useStore();
  const [code, setCode] = useState('');
  const total = Math.max(0, cartSubtotal - discount);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIP_THRESHOLD) * 100);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!cartOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div
        className={`absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col glass-strong shadow-lift border-l border-white/20 transition-transform duration-500 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold-500" />
            <h2 className="font-display text-lg font-bold">{t('Cart')}</h2>
            <span className="rounded-full bg-ink-100 dark:bg-ink-700 px-2 py-0.5 text-xs font-semibold text-ink-600 dark:text-ink-300">
              {cart.length}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </header>

        {/* Free shipping bar */}
        {cart.length > 0 && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
              <Truck size={14} className="text-gold-500" />
              {remaining > 0 ? (
                <span>Add <strong className="text-ink-900 dark:text-white">{formatBDT(remaining)}</strong> for free shipping</span>
              ) : (
                <span className="text-emerald-600 font-medium">You have unlocked free shipping!</span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
              <div className="h-full rounded-full bg-gold-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-ink-100 dark:bg-ink-800">
                <ShoppingBag size={28} className="text-ink-400" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">{t('Empty Cart')}</p>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Discover pieces worth wearing.</p>
              </div>
              <button onClick={() => { setCartOpen(false); navigate({ name: 'shop' }); }} className="btn-dark">{t('Continue Shopping')}</button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item, i) => (
                <li key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 rounded-xl border border-black/5 dark:border-white/10 p-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-24 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold leading-snug">{item.product.name}</h3>
                        <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">{item.color} • Size {item.size}</p>
                      </div>
                      <button onClick={() => removeFromCart(i)} aria-label="Remove" className="text-ink-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-black/10 dark:border-white/15 p-1">
                        <button onClick={() => updateQty(i, -1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(i, 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">{formatBDT(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coupon + summary */}
        {cart.length > 0 && (
          <div className="border-t border-black/5 dark:border-white/10 p-5">
            {coupon ? (
              <div className="mb-3 flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><Tag size={14} /> {coupon} applied</span>
                <button onClick={removeCoupon} className="text-xs text-ink-500 hover:text-red-500">{t('Remove')}</button>
              </div>
            ) : (
              <div className="mb-3 flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('Coupon')} className="input-lux flex-1 py-2.5 text-sm" />
                <button onClick={() => { if (applyCoupon(code)) setCode(''); }} className="rounded-xl bg-ink-100 dark:bg-ink-700 px-4 text-sm font-semibold hover:bg-ink-200 dark:hover:bg-ink-600">{t('Apply')}</button>
              </div>
            )}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-600 dark:text-ink-300"><span>{t('Subtotal')}</span><span>{formatBDT(cartSubtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t('Discount')}</span><span>-{formatBDT(discount)}</span></div>}
              <div className="flex justify-between text-ink-600 dark:text-ink-300"><span>{t('Shipping')}</span><span>{total >= FREE_SHIP_THRESHOLD ? 'Free' : 'Calculated at checkout'}</span></div>
              <div className="flex justify-between border-t border-black/5 dark:border-white/10 pt-2 text-base font-bold text-ink-900 dark:text-white"><span>{t('Total')}</span><span>{formatBDT(total)}</span></div>
            </div>
            <button onClick={() => { setCartOpen(false); navigate({ name: 'checkout' }); }} className="btn-dark mt-4 w-full">{t('Checkout')}</button>
            <button onClick={() => { setCartOpen(false); navigate({ name: 'shop' }); }} className="mt-2 w-full text-center text-xs font-medium text-ink-500 hover:text-ink-900 dark:hover:text-white">{t('Continue Shopping')}</button>
          </div>
        )}
      </aside>
    </div>
  );
}
