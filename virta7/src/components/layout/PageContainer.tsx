import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`mx-auto w-full max-w-md px-5 py-6 ${className}`}>{children}</div>;
}
