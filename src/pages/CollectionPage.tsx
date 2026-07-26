import { useStore } from '../store';
import { useReveal } from '../hooks';
import { collections } from '../data/products';
import ProductCard from '../components/ProductCard';

export function CollectionPage({ id }: { id: string }) {
  const { products } = useStore();
  const ref = useReveal<HTMLDivElement>();
  const c = collections.find((x) => x.id === id) || collections[0];
  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-lux relative flex h-full items-end pb-12 text-white">
          <div>
            <div className="eyebrow text-gold-300">{c.count} pieces</div>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{c.name}</h1>
            <p className="mt-2 text-white/85">{c.tagline}</p>
          </div>
        </div>
      </section>
      <section className="container-lux py-14">
        <div ref={ref} className="reveal grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.filter((p) => p.published !== false).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

export default CollectionPage;
