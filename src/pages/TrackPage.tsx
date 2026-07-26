import { useState } from 'react';
import { Package, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../store';
import { SectionHeading } from '../components/ui';

export function TrackPage() {
  const [tracked, setTracked] = useState(false);
  const { toast } = useStore();
  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="Order tracking" title="Track Your Order" subtitle="Enter your order number and email to see the latest status." align="center" />
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
        <form onSubmit={(e) => { e.preventDefault(); setTracked(true); toast('Order found'); }} className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Order number (e.g. CF-123456)" className="input-lux sm:col-span-2" />
          <input required type="email" placeholder="Email used at checkout" className="input-lux sm:col-span-2" />
          <button className="btn-dark sm:col-span-2"><Package size={16} /> Track Order</button>
        </form>
        {tracked && (
          <div className="mt-6 space-y-4">
            {[
              { label: 'Order placed', done: true, icon: <Package size={14} /> },
              { label: 'Crafting & packing', done: true, icon: <Sparkles size={14} /> },
              { label: 'Shipped', done: true, icon: <Truck size={14} /> },
              { label: 'Out for delivery', done: false, icon: <Truck size={14} /> },
              { label: 'Delivered', done: false, icon: <Package size={14} /> },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-full ${s.done ? 'bg-emerald-500 text-white' : 'bg-ink-100 dark:bg-ink-700 text-ink-400'}`}>{s.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${s.done ? '' : 'text-ink-500'}`}>{s.label}</div>
                  <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-700">
                    <div className={`h-full rounded-full bg-emerald-500 transition-all`} style={{ width: s.done ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackPage;
