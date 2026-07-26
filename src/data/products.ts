import type { Product, Review } from '../types';

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const sampleReviews = (seed: string): Review[] => [
  {
    id: `${seed}-r1`,
    name: 'Ayesha Rahman',
    rating: 5,
    date: '2026-06-12',
    title: 'Absolutely premium',
    body: 'The fabric feels luxurious and the fit is perfect. Worth every penny — feels like a true designer piece.',
  },
  {
    id: `${seed}-r2`,
    name: 'Tanvir Hasan',
    rating: 4,
    date: '2026-05-28',
    title: 'Great quality, runs slightly small',
    body: 'Beautiful craftsmanship. I would recommend sizing up for a more relaxed fit. Shipping was fast.',
  },
  {
    id: `${seed}-r3`,
    name: 'Sara Khan',
    rating: 5,
    date: '2026-05-02',
    title: 'My new favorite',
    body: 'I have received so many compliments. The stitching and finishing are impeccable. Will buy again.',
  },
];

const baseColors = [
  { name: 'Black', hex: '#0A0A0A' },
  { name: 'Ivory', hex: '#F4F1EA' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Stone', hex: '#B8B0A0' },
  { name: 'Navy', hex: '#1B2A41' },
  { name: 'Cocoa', hex: '#4A3B2A' },
];

const pickColors = (n: number) => baseColors.slice(0, n);
const sizesClothing = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sizesShoes = ['40', '41', '42', '43', '44', '45'];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Midnight Tailored Blazer',
    brand: 'CrazyFeb Atelier',
    category: 'men',
    gender: 'men',
    price: 24900,
    originalPrice: 32000,
    rating: 4.9,
    reviewCount: 128,
    colors: pickColors(4),
    sizes: sizesClothing,
    images: [img(7679720), img(7679871), img(7679721), img(7679726)],
    description: 'A sharply tailored blazer in midnight wool-blend with a soft brushed finish. Designed for the modern gentleman who values quiet luxury.',
    details: ['70% wool, 30% polyester', 'Fully lined', 'Horn-look buttons', 'Dry clean only', 'Made in Italy'],
    tags: ['bestseller', 'trending'],
    badge: 'Best Seller',
    inStock: true,
    reviews: sampleReviews('p1'),
  },
  {
    id: 'p2',
    name: 'Ivory Silk Slip Dress',
    brand: 'CrazyFeb Atelier',
    category: 'women',
    gender: 'women',
    price: 18900,
    originalPrice: 24000,
    rating: 4.8,
    reviewCount: 96,
    colors: pickColors(3),
    sizes: sizesClothing,
    images: [img(7679721), img(7679871), img(7679720), img(7679726)],
    description: 'A fluid silk slip dress with a delicate bias cut and adjustable straps. Effortless evening elegance.',
    details: ['100% mulberry silk', 'Bias cut', 'Adjustable straps', 'Hand wash cold', 'Made in France'],
    tags: ['new', 'trending'],
    badge: 'New',
    inStock: true,
    reviews: sampleReviews('p2'),
  },
  {
    id: 'p3',
    name: 'Gold Stitched Cashmere Coat',
    brand: 'CrazyFeb Atelier',
    category: 'women',
    gender: 'women',
    price: 42000,
    rating: 5,
    reviewCount: 54,
    colors: pickColors(2),
    sizes: sizesClothing,
    images: [img(7679871), img(7679720), img(7679721), img(7679726)],
    description: 'A longline cashmere coat with signature gold-thread stitching along the lapel. A limited-edition statement of craftsmanship.',
    details: ['95% cashmere, 5% wool', 'Gold-thread detailing', 'Concealed front closure', 'Dry clean only', 'Limited to 200 pieces'],
    tags: ['limited'],
    badge: 'Limited',
    inStock: true,
    reviews: sampleReviews('p3'),
  },
  {
    id: 'p4',
    name: 'Minimal Leather Sneakers',
    brand: 'CrazyFeb Studio',
    category: 'shoes',
    gender: 'unisex',
    price: 12500,
    originalPrice: 16000,
    rating: 4.7,
    reviewCount: 210,
    colors: pickColors(3),
    sizes: sizesShoes,
    images: [img(7679726), img(7679720), img(7679871), img(7679721)],
    description: 'Clean-lined sneakers in full-grain leather with a cushioned footbed. A versatile essential for everyday luxury.',
    details: ['Full-grain leather', 'Memory-foam insole', 'Rubber outsole', 'Made in Portugal'],
    tags: ['bestseller', 'flash'],
    badge: 'Flash Sale',
    inStock: true,
    reviews: sampleReviews('p4'),
  },
  {
    id: 'p5',
    name: 'Heritage Wool Overcoat',
    brand: 'CrazyFeb Atelier',
    category: 'men',
    gender: 'men',
    price: 38000,
    rating: 4.9,
    reviewCount: 73,
    colors: pickColors(4),
    sizes: sizesClothing,
    images: [img(7679720), img(7679871), img(7679726), img(7679721)],
    description: 'A timeless double-breasted overcoat in heritage wool. Structured shoulders, softened by a relaxed drape.',
    details: ['80% wool, 20% cashmere', 'Double-breasted', 'Full satin lining', 'Dry clean only', 'Made in Italy'],
    tags: ['new', 'trending'],
    badge: 'New',
    inStock: true,
    reviews: sampleReviews('p5'),
  },
  {
    id: 'p6',
    name: 'Pleated Maxi Skirt',
    brand: 'CrazyFeb Studio',
    category: 'women',
    gender: 'women',
    price: 9800,
    originalPrice: 14000,
    rating: 4.6,
    reviewCount: 142,
    colors: pickColors(5),
    sizes: sizesClothing,
    images: [img(7679721), img(7679871), img(7679726), img(7679720)],
    description: 'A high-waisted pleated maxi skirt with graceful movement. Pairs effortlessly with knits and tailoring.',
    details: ['Recycled polyester', 'Knife pleats', 'Elasticated waist', 'Machine wash cold'],
    tags: ['bestseller'],
    inStock: true,
    reviews: sampleReviews('p6'),
  },
  {
    id: 'p7',
    name: 'Structured Leather Tote',
    brand: 'CrazyFeb Atelier',
    category: 'bags',
    gender: 'women',
    price: 21500,
    rating: 4.8,
    reviewCount: 88,
    colors: pickColors(3),
    sizes: ['One Size'],
    images: [img(7679871), img(7679720), img(7679726), img(7679721)],
    description: 'A structured top-handle tote in smooth Italian leather. Spacious, elegant, and built to last.',
    details: ['Italian calfskin', 'Suede lining', 'Magnetic closure', 'Comes with dust bag'],
    tags: ['trending', 'new'],
    badge: 'New',
    inStock: true,
    reviews: sampleReviews('p7'),
  },
  {
    id: 'p8',
    name: 'Merino Crew Sweater',
    brand: 'CrazyFeb Studio',
    category: 'men',
    gender: 'men',
    price: 7600,
    originalPrice: 11000,
    rating: 4.7,
    reviewCount: 167,
    colors: pickColors(6),
    sizes: sizesClothing,
    images: [img(7679720), img(7679871), img(7679726), img(7679721)],
    description: 'A fine-gauge merino crewneck with a refined handfeel. An everyday layering staple.',
    details: ['100% extra-fine merino wool', 'Ribbed trims', 'Machine washable wool cycle', 'Made in Scotland'],
    tags: ['flash', 'bestseller'],
    badge: 'Flash Sale',
    inStock: true,
    reviews: sampleReviews('p8'),
  },
  {
    id: 'p9',
    name: 'Satin Wrap Blouse',
    brand: 'CrazyFeb Studio',
    category: 'women',
    gender: 'women',
    price: 8400,
    rating: 4.6,
    reviewCount: 64,
    colors: pickColors(4),
    sizes: sizesClothing,
    images: [img(7679721), img(7679871), img(7679720), img(7679726)],
    description: 'A fluid satin wrap blouse with a flattering V-neckline and tie waist. Desk-to-dinner versatility.',
    details: ['Recycled satin', 'Wrap front', 'Adjustable tie', 'Hand wash cold'],
    tags: ['new'],
    badge: 'New',
    inStock: true,
    reviews: sampleReviews('p9'),
  },
  {
    id: 'p10',
    name: 'Tailored Wide-Leg Trousers',
    brand: 'CrazyFeb Atelier',
    category: 'men',
    gender: 'men',
    price: 11200,
    originalPrice: 15000,
    rating: 4.8,
    reviewCount: 119,
    colors: pickColors(4),
    sizes: sizesClothing,
    images: [img(7679720), img(7679871), img(7679726), img(7679721)],
    description: 'Pleated wide-leg trousers with a clean drape and tailored finish. A modern take on a classic silhouette.',
    details: ['Wool-blend suiting', 'Single pleat', 'Hook-and-bar closure', 'Dry clean recommended'],
    tags: ['bestseller', 'trending'],
    inStock: true,
    reviews: sampleReviews('p10'),
  },
  {
    id: 'p11',
    name: 'Cashmere Scarf',
    brand: 'CrazyFeb Atelier',
    category: 'accessories',
    gender: 'unisex',
    price: 5400,
    rating: 4.9,
    reviewCount: 203,
    colors: pickColors(5),
    sizes: ['One Size'],
    images: [img(7679871), img(7679720), img(7679726), img(7679721)],
    description: 'An oversized cashmere scarf with hand-finished fringe. Whisper-soft warmth in a timeless design.',
    details: ['100% cashmere', 'Hand-finished fringe', '180 x 70 cm', 'Made in Mongolia'],
    tags: ['limited'],
    badge: 'Limited',
    inStock: true,
    reviews: sampleReviews('p11'),
  },
  {
    id: 'p12',
    name: 'Leather Chelsea Boots',
    brand: 'CrazyFeb Studio',
    category: 'shoes',
    gender: 'men',
    price: 16800,
    originalPrice: 21000,
    rating: 4.7,
    reviewCount: 91,
    colors: pickColors(2),
    sizes: sizesShoes,
    images: [img(7679726), img(7679720), img(7679871), img(7679721)],
    description: 'Sleek Chelsea boots in polished leather with elastic side gussets. Refined and effortlessly wearable.',
    details: ['Full-grain leather', 'Goodyear-welted', 'Leather sole', 'Made in Portugal'],
    tags: ['trending'],
    inStock: true,
    reviews: sampleReviews('p12'),
  },
];

export const collections = [
  {
    id: 'winter-noir',
    name: 'Winter Noir',
    tagline: 'Dark tailoring for the cold months',
    image: `https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    count: 24,
  },
  {
    id: 'ivory-dreams',
    name: 'Ivory Dreams',
    tagline: 'Light, fluid, and quietly luxurious',
    image: `https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    count: 18,
  },
  {
    id: 'gilded-hour',
    name: 'The Gilded Hour',
    tagline: 'Limited-edition evening pieces',
    image: `https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    count: 12,
  },
  {
    id: 'urban-essential',
    name: 'Urban Essential',
    tagline: 'Everyday luxury, redefined',
    image: `https://images.pexels.com/photos/7679726/pexels-photo-7679726.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    count: 32,
  },
];

export const testimonials = [
  {
    name: 'Nusrat Jahan',
    role: 'Creative Director',
    avatar: `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200`,
    quote: 'CrazyFeb has completely redefined my wardrobe. The quality rivals European maisons, with a sensibility that feels modern and personal.',
  },
  {
    name: 'Rafi Ahmed',
    role: 'Architect',
    avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200`,
    quote: 'Every piece I have bought has aged beautifully. The stitching, the fabric, the drape — it is the real thing.',
  },
  {
    name: 'Maliha Karim',
    role: 'Stylist',
    avatar: `https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200`,
    quote: 'I recommend CrazyFeb to all my clients. It is the rare brand that balances restraint with personality.',
  },
];

export const instagramPosts = [
  { id: 'ig1', image: `https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '4.2k' },
  { id: 'ig2', image: `https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '3.8k' },
  { id: 'ig3', image: `https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '5.1k' },
  { id: 'ig4', image: `https://images.pexels.com/photos/7679726/pexels-photo-7679726.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '2.9k' },
  { id: 'ig5', image: `https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '6.3k' },
  { id: 'ig6', image: `https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=600`, likes: '3.4k' },
];

export const formatBDT = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(n);

// Hydrate products array from localStorage in-place so all references see updates
if (typeof window !== 'undefined') {
  const LOCAL_STORAGE_KEY = 'crazyfeb-products';
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('parvej-products');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        products.length = 0;
        products.push(...parsed);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, saved);
      localStorage.removeItem('parvej-products');
    } catch (e) {
      console.error('Failed to parse products from localStorage', e);
    }
  } else {
    products.forEach((p: any) => {
      if (p.stock === undefined) {
        p.stock = Math.floor(Math.random() * 40) + 5;
      }
      if (p.published === undefined) {
        p.published = true;
      }
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }
}
