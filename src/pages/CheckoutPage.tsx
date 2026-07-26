import { useState } from 'react';
import { Check, CreditCard, Lock, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../store';
import { formatBDT } from '../data/products';
import { ordersService } from '../lib/ordersService';

type Pay = 'cod' | 'bkash' | 'nagad' | 'visa' | 'mastercard';

export default function CheckoutPage() {
  const { cart, cartSubtotal, discount, coupon, navigate, toast, t, siteSettings, clearCart } = useStore();
  const [pay, setPay] = useState<Pay>('cod');
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    updatesEmail: true,
  });

  const total = Math.max(0, cartSubtotal - discount);
  const shipping = total >= 15000 ? 0 : 120;
  const grand = total + shipping;

  if (placed) {
    return (
      <div className="container-lux py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <Check size={28} />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold">{t('Order Successful')}</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">Thank you for your purchase. A confirmation has been sent to your email. Your order number is <strong className="text-ink-900 dark:text-white">#{orderId}</strong>.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate({ name: 'track' })} className="btn-dark">Track Order</button>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-ghost">{t('Continue Shopping')}</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-lux py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ink-100 dark:bg-ink-800"><ShoppingBag size={28} className="text-ink-400" /></div>
        <h1 className="mt-5 font-display text-2xl font-bold">{t('Empty Cart')}</h1>
        <p className="mt-2 text-sm text-ink-500">Add a few pieces to check out.</p>
        <button onClick={() => navigate({ name: 'shop' })} className="btn-dark mt-6">{t('Continue Shopping')}</button>
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const createdOrder = await ordersService.createOrder({
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images[0] || '',
        })),
        customerInfo: form,
        paymentMethod: pay,
        subtotal: cartSubtotal,
        discount,
        shipping,
        total: grand,
      });

      const displayId = createdOrder.id.startsWith('CF-') ? createdOrder.id : `CF-${createdOrder.id}`;
      setOrderId(displayId);
      clearCart();
      setPlaced(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error('Failed to place order:', err);
      toast('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const payOptions: { id: Pay; label: string; desc: string }[] = [
    { id: 'cod', label: t('Cash on delivery'), desc: 'Pay when you receive' },
    { id: 'bkash', label: 'bKash', desc: 'Mobile wallet' },
    { id: 'nagad', label: 'Nagad', desc: 'Mobile wallet' },
    { id: 'visa', label: 'Visa', desc: 'Credit / debit card' },
    { id: 'mastercard', label: 'Mastercard', desc: 'Credit / debit card' },
  ];

  return (
    <div className="container-lux py-10">
      <h1 className="mb-8 font-display text-4xl font-bold">{t('Checkout')}</h1>
      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Contact */}
          <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">{t('Shipping Address')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder={t('First Name')} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-lux" />
              <input required placeholder={t('Last Name')} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-lux" />
              <input required type="email" placeholder={t('Email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-lux" />
              <input required type="tel" placeholder={t('Phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-lux" />
              <input required placeholder={t('Shipping Address')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-lux sm:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-lux" />
              <input required placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input-lux" />
              <select required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-lux sm:col-span-2">
                <option value="">Country / Region</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-ink-500 cursor-pointer">
              <input type="checkbox" checked={form.updatesEmail} onChange={(e) => setForm({ ...form, updatesEmail: e.target.checked })} className="h-4 w-4 accent-gold-500" /> Send me order updates via email
            </label>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">{t('Shipping')}</h2>
            <div className="space-y-2">
              {[
                { id: 'std', label: 'Standard', desc: siteSettings.deliveryTime || '3–5 business days', price: shipping === 0 ? 'Free' : formatBDT(120) },
                { id: 'exp', label: 'Express', desc: '1–2 business days', price: formatBDT(350) },
              ].map((s, i) => (
                <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${i === 0 ? 'border-gold-400 bg-gold-400/5' : 'border-black/10 dark:border-white/15'}`}>
                  <input type="radio" name="ship" defaultChecked={i === 0} className="h-4 w-4 accent-gold-500" />
                  <Truck size={18} className="text-gold-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-ink-500">{s.desc}</div>
                  </div>
                  <span className="text-sm font-bold">{s.price}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">{t('Payment')}</h2>
            <div className="space-y-2">
              {payOptions.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${pay === p.id ? 'border-gold-400 bg-gold-400/5' : 'border-black/10 dark:border-white/15'}`}>
                  <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} className="h-4 w-4 accent-gold-500" />
                  <CreditCard size={18} className="text-gold-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.label}</div>
                    <div className="text-xs text-ink-500">{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {(pay === 'visa' || pay === 'mastercard') && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input required placeholder="Card number" className="input-lux sm:col-span-2" />
                <input required placeholder="Name on card" className="input-lux sm:col-span-2" />
                <input required placeholder="MM / YY" className="input-lux" />
                <input required placeholder="CVC" className="input-lux" />
              </div>
            )}
            {(pay === 'bkash' || pay === 'nagad') && (
              <div className="mt-4">
                <input required placeholder="Mobile account number" className="input-lux" />
              </div>
            )}
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-500"><Lock size={12} /> Payments are encrypted and secure.</p>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">{t('Order Summary')}</h2>
          <ul className="max-h-72 space-y-3 overflow-y-auto">
            {cart.map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className="relative">
                  <img src={item.product.images[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink-900 px-1 text-[10px] font-bold text-white dark:bg-white dark:text-ink-900">{item.quantity}</span>
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold leading-snug">{item.product.name}</div>
                  <div className="text-xs text-ink-500">{item.color} • {item.size}</div>
                </div>
                <div className="text-sm font-bold">{formatBDT(item.product.price * item.quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-1.5 border-t border-black/5 dark:border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-600 dark:text-ink-300"><span>{t('Subtotal')}</span><span>{formatBDT(cartSubtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t('Discount')} ({coupon})</span><span>-{formatBDT(discount)}</span></div>}
            <div className="flex justify-between text-ink-600 dark:text-ink-300"><span>{t('Shipping')}</span><span>{shipping === 0 ? 'Free' : formatBDT(shipping)}</span></div>
            <div className="flex justify-between border-t border-black/5 dark:border-white/10 pt-2 text-base font-bold text-ink-900 dark:text-white"><span>{t('Total')}</span><span>{formatBDT(grand)}</span></div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-dark mt-5 w-full disabled:opacity-50">{isSubmitting ? 'Processing...' : `${t('Place Order')} — ${formatBDT(grand)}`}</button>
          <button type="button" onClick={() => { toast('Order saved as draft'); }} className="mt-2 w-full text-center text-xs text-ink-500 hover:text-ink-900 dark:hover:text-white">Save for later</button>
        </aside>
      </form>
    </div>
  );
}

