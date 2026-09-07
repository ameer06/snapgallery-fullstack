import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="bg-surface-container-lowest border border-stroke-subtle rounded-xl overflow-hidden group hover:border-secondary transition-colors duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-surface-charcoal/80 backdrop-blur-sm px-2 py-1 rounded">
          <span className="font-mono text-label-caps tracking-[0.08em] uppercase text-secondary-fixed text-[10px]">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-headline-sm font-semibold text-primary mb-2">{product.name}</h3>
        <p className="text-body-md text-on-surface-variant mb-4 flex-1">{product.shortDescription}</p>

        {/* Turnaround */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-label-caps tracking-[0.08em] uppercase text-text-muted text-[10px]">
            Turnaround
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant">
            {product.turnaround}
          </span>
        </div>

        {/* CTA */}
        <Link
          to={`/products/${product.slug}`}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:gap-2 transition-all duration-200"
          aria-label={`Learn more about ${product.name}`}
        >
          Learn More <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
