import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  'aria-label'?: string;
}

const sizes = {
  sm: 'px-4 py-2 text-label-md',
  md: 'px-6 py-3 text-label-md',
  lg: 'px-8 py-4 text-label-md',
};

export default function Button({
  variant = 'primary',
  children,
  href,
  to,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  size = 'md',
  fullWidth = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const classes = `${base} ${sizes[size]} ${fullWidth ? 'w-full justify-center' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
