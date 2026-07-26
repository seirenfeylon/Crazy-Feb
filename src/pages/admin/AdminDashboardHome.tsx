import { Package, ShoppingCart, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="card-lux hover-lift p-6">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="font-display text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-300">{label}</div>
        {hint && <div className="mt-2 text-[11px] text-ink-400">{hint}</div>}
      </div>
    </div>
  );
}

export function AdminDashboardHome() {
  const { navigate, products } = useStore();

  const totalProducts = products.length;
  const inStock = products.filter((r) => (r.stock ?? 0) > 0 && r.inStock !== false).length;
  const lowStock = products.filter((r) => (r.stock ?? 0) > 0 && (r.stock ?? 0) <= 5).length;
  const outOfStock = products.filter((r) => (r.stock ?? 0) === 0 || r.inStock === false).length;
  const recent = products.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Package size={20} />} label="Total Products" value={totalProducts.toString()} />
        <StatCard icon={<TrendingUp size={20} />} label="In Stock" value={inStock.toString()} hint={`${lowStock} low · ${outOfStock} out`} />
        <StatCard icon={<ShoppingCart size={20} />} label="Orders" value="—" hint="Coming soon" />
        <StatCard icon={<Users size={20} />} label="Customers" value="—" hint="Coming soon" />
      </div>

      <div className="card-lux overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-6 py-4">
          <div>
            <h3 className="font-display text-base font-bold">Recent Products</h3>
            <p className="text-xs text-ink-500 dark:text-ink-300">A snapshot of your current catalog.</p>
          </div>
          <button
            onClick={() => navigate({ name: 'admin', section: 'products' })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 dark:text-gold-300 hover:gap-2 transition-all"
          >
            Manage <ArrowRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-6 py-3.5">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-700">
                {r.images && r.images[0] && <img src={r.images[0]} alt={r.name} className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs capitalize text-ink-500 dark:text-ink-300">{r.category}</div>
              </div>
              <div className="text-sm font-semibold">৳{r.price.toLocaleString()}</div>
              <div className="text-xs text-ink-500 dark:text-ink-300">{r.stock} in stock</div>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-ink-500 dark:text-ink-300">No products yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
