import { Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import type { Route } from '../types';

const cols: { title: string; links: { label: string; route?: Route }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', route: { name: 'shop' } },
      { label: 'Best Sellers', route: { name: 'shop' } },
      { label: 'Men', route: { name: 'shop', gender: 'men' } },
      { label: 'Women', route: { name: 'shop', gender: 'women' } },
      { label: 'Collections', route: { name: 'collections' } },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping Policy' },
      { label: 'Return Policy' },
      { label: 'Order Tracking', route: { name: 'track' } },
      { label: 'Size Guide' },
      { label: 'FAQs' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', route: { name: 'about' } },
      { label: 'Sustainability' },
      { label: 'Craftsmanship' },
      { label: 'Careers' },
      { label: 'Press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy' },
      { label: 'Terms & Conditions' },
      { label: 'Cookie Policy' },
      { label: 'Accessibility' },
      { label: 'Contact', route: { name: 'contact' } },
    ],
  },
];

function safeExternalUrl(raw?: string): string {
  if (!raw) return '#';
  try {
    const url = new URL(raw, window.location.origin);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '#';
  } catch {
    return '#';
  }
}

export default function Footer() {
  const { navigate, toast, siteSettings } = useStore();
  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast('Please enter a valid email'); return; }
    toast(`Subscribed — welcome to ${siteSettings.storeName || 'CrazyFeb'}`);
    setEmail('');
  };

  const socials = [
    { icon: Instagram, url: safeExternalUrl(siteSettings.socialInstagram || 'https://instagram.com') },
    { icon: Facebook, url: safeExternalUrl(siteSettings.socialFacebook || 'https://facebook.com') },
    { icon: Twitter, url: safeExternalUrl(siteSettings.socialTwitter || 'https://twitter.com') },
  ];

  const paymentMethods = (siteSettings.footerSmallNotice || "Visa • Mastercard • bKash • Nagad • COD")
    .split(/[•|,]/)
    .map((x) => x.trim())
    .filter(Boolean);

  return (
    <footer className="mt-10 bg-ink-900 text-white">
      <div className="container-lux py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/branding/icon.svg" alt={siteSettings.storeName || "CrazyFeb"} className="h-9 w-9 transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.45)]" />
              <img src="/branding/logo-white.svg" alt={siteSettings.storeName || "CrazyFeb"} className="h-8 transition-all duration-500 hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.45)]" />
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/70">
              {siteSettings.footerDescription || "Premium fashion crafted for the modern lifestyle. Quiet luxury, made to last — designed in-house, crafted by hand."}
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/70">
              {siteSettings.contactAddress && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gold-400 shrink-0" />
                  {siteSettings.contactAddress}
                </div>
              )}
              {siteSettings.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gold-400 shrink-0" />
                  {siteSettings.contactPhone}
                </div>
              )}
              {siteSettings.contactEmailSupport && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gold-400 shrink-0" />
                  {siteSettings.contactEmailSupport}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              {socials.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/80 transition-all hover:bg-gold-400 hover:text-ink-900">
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-300">{c.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={() => l.route && navigate(l.route)}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-2">
          <div>
            <h4 className="font-display text-lg font-semibold">Join the {siteSettings.storeName || 'CrazyFeb'} circle</h4>
            <p className="mt-1 text-sm text-white/70">Early access to collections, private sales, and 20% off your first order.</p>
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none focus:border-gold-400" />
            <button className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-gold-300">
              <Send size={15} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>{siteSettings.footerCopyright || `© ${new Date().getFullYear()} CrazyFeb. All rights reserved.`}</p>
          <div className="flex items-center gap-3">
            {paymentMethods.map((pm) => (
              <span key={pm}>{pm}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
