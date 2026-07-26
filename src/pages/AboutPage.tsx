import { Award, Heart, Leaf } from 'lucide-react';
import { useStore } from '../store';

export function AboutPage() {
  const { navigate } = useStore();
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src="https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-lux relative flex h-full items-center text-white">
          <div className="max-w-xl">
            <div className="eyebrow text-gold-300">Our Story</div>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Quiet luxury, made to last</h1>
            <p className="mt-4 text-white/85">CrazyFeb began with a simple belief: that premium fashion should feel personal, considered, and enduring. We design in-house, source the finest materials, and partner with artisans who care about the craft.</p>
          </div>
        </div>
      </section>

      <section className="container-lux py-20">
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {[
            { icon: <Award size={22} />, t: 'Craftsmanship', d: 'Every piece is finished by hand in family-run ateliers across Italy, Portugal, and France.' },
            { icon: <Leaf size={22} />, t: 'Responsibility', d: 'We use certified wools, organic cottons, and recycled fibers wherever possible.' },
            { icon: <Heart size={22} />, t: 'Made to last', d: 'Timeless silhouettes and durable construction — designed to be worn for years.' },
          ].map((v) => (
            <div key={v.t} className="card-lux hover-lift p-7">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-400/15 text-gold-600">{v.icon}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-white">
        <div className="container-lux grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="eyebrow text-gold-300">The atelier</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">From sketch to wardrobe</h2>
            <p className="mt-4 max-w-md text-white/80">Each collection begins with a mood, a fabric, and a conversation. We prototype in-house, refine for fit, and produce in small runs — so every piece arrives considered.</p>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-gold mt-6">Explore the shop</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src="https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
