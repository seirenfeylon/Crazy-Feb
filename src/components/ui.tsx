import { Star } from 'lucide-react';

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ink-300 dark:text-ink-500" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="text-gold-400 fill-gold-400" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-xs font-medium text-ink-500 dark:text-ink-300">
        {value.toFixed(1)}
        {typeof count === 'number' && <span className="ml-1 text-ink-400">({count})</span>}
      </span>
    </div>
  );
}

export function Badge({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'dark' | 'red' | 'green' }) {
  const tones: Record<string, string> = {
    gold: 'bg-gold-400 text-ink-900',
    dark: 'bg-ink-900 text-white',
    red: 'bg-red-600 text-white',
    green: 'bg-emerald-600 text-white',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} sm:flex-row sm:items-end sm:justify-between`}>
      <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-3 text-sm sm:text-base text-ink-500 dark:text-ink-300 max-w-xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
