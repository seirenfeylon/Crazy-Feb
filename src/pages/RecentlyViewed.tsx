import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { SectionHeading } from '../components/ui';

export function RecentlyViewed() {
  const { recentlyViewed, navigate } = useStore();
  if (recentlyViewed.length === 0) return null;
  return (
    <section className="container-lux py-14">
      <SectionHeading eyebrow="Pick up where you left off" title="Recently Viewed" action={<button onClick={() => navigate({ name: 'shop' })} className="btn-ghost">View all</button>} />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {recentlyViewed.filter((p) => p.published !== false).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export default RecentlyViewed;
