import { Heart } from 'lucide-react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { SectionHeading } from '../components/ui';

export function WishlistPage() {
  const { wishlist, navigate, products } = useStore();
  const list = products.filter((p) => p.published !== false && wishlist.includes(p.id));
  return (
    <div className="container-lux py-14">
      <SectionHeading eyebrow="Saved for later" title="Your Wishlist" subtitle={list.length ? `${list.length} saved pieces` : 'No saved pieces yet.'} />
      {list.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-black/10 dark:border-white/15 py-20 text-center">
          <div>
            <Heart size={28} className="mx-auto text-ink-400" />
            <p className="mt-4 font-display text-xl font-semibold">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-ink-500">Tap the heart on any product to save it here.</p>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-dark mt-5">Discover pieces</button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
