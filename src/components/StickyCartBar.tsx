'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types/products';

interface StickyCartBarProps {
  product: IProduct;
}

export function StickyCartBar({ product }: StickyCartBarProps) {
  const [visible, setVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const displayPrice = product.discountPrice ?? product.price;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur-xl md:px-8"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="hidden items-center gap-4 sm:flex min-w-0">
              <span className="truncate text-sm font-semibold text-foreground">{product.name}</span>
              <span className="shrink-0 text-lg font-black text-foreground">৳{displayPrice.toLocaleString()}</span>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3 sm:flex-initial sm:justify-normal">
              {/* Quick size */}
              <div className="flex gap-1.5">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Button
                className="h-10 gap-2 rounded-xl px-5 text-sm font-bold"
                disabled={product.stock === 0}
              >
                <ShoppingBag size={15} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}