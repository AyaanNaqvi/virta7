import { Image } from 'lucide-react';

export function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-4/3 w-full items-center justify-center rounded-3xl bg-surface-alt border border-border"
      role="img"
      aria-label={label}
    >
      <Image className="h-16 w-16 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
