import { Star } from 'lucide-react';

interface StarBadgeProps {
  count: number;
  size?: 'sm' | 'lg';
}

export function StarBadge({ count, size = 'sm' }: StarBadgeProps) {
  const isLg = size === 'lg';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-bg font-bold text-accent
        ${isLg ? 'px-4 py-2 text-2xl' : 'px-3 py-1.5 text-base'}`}
    >
      <Star className={isLg ? 'h-7 w-7 fill-accent' : 'h-5 w-5 fill-accent'} aria-hidden="true" />
      {count}
    </span>
  );
}
