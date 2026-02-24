'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IProduct } from '@/types/products';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';
import { PackageX } from 'lucide-react';

interface ProductGridProps {
  products: IProduct[];
  view: 'grid' | 'list';
  isPending?: boolean;
}

export function ProductGrid({ products, view, isPending }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 py-24 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-muted">
          <PackageX size={32} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn('transition-opacity duration-300', isPending && 'opacity-50 pointer-events-none')}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-4'
          )}
        >
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}