import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl bg-surface border border-border p-5 ${className}`}
      {...rest}
    />
  );
}
