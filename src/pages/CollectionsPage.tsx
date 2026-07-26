import { useStore } from '../store';
import { collections } from '../data/products';
import { SectionHeading } from '../components/ui';

export function CollectionsPage() {
  const { navigate } = useStore();
  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="Curated edits" title="All Collections" subtitle="Considered capsules, each designed around a single mood." align="center" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {collections.map((c) => (
          <button key={c.id} onClick={() => navigate({ name: 'collection', id: c.id })} className="group relative aspect-[16/10] overflow-hidden rounded-2xl text-left">
            <div className="zoom-img absolute inset-0"><img src={c.image} alt={c.name} className="h-full w-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-300">{c.count} pieces</div>
              <h3 className="mt-2 font-display text-3xl font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CollectionsPage;
