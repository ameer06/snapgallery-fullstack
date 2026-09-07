import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`feature-card group ${className}`}>
      <div className="feature-card-icon">
        {icon}
      </div>
      <h3 className="text-headline-sm font-semibold text-primary mb-2">{title}</h3>
      <p className="text-body-md text-on-surface-variant">{description}</p>
    </div>
  );
}
