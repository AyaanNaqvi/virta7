import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'alert';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white',
  secondary: 'bg-secondary hover:bg-secondary-hover text-white',
  ghost: 'bg-surface border-2 border-border text-text hover:bg-surface-alt',
  alert: 'bg-alert text-white hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  md: 'min-h-11 px-5 text-base',
  lg: 'min-h-14 px-6 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
