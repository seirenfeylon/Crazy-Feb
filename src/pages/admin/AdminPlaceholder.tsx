import type { LucideIcon } from 'lucide-react';

export function AdminPlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="card-lux flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900">
        <Icon size={28} />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-ink-500 dark:text-ink-300">{description}</p>
      <span className="mt-5 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-300">
        Coming soon
      </span>
    </div>
  );
}
