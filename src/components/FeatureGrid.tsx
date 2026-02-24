'use client';

import { IProduct } from '@/types/products';
import { FeaturedCard } from './FeatureCard';


interface FeaturedGridProps {
  products: IProduct[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        No featured products right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {products.map((product, index) => (
        <FeaturedCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}