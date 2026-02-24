'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_LABELS: Record<string, string> = {
  gender: 'Gender',
  category: 'Category',
  size: 'Size',
  color: 'Color',
  search: 'Search',
  minPrice: 'Min Price',
  maxPrice: 'Max Price',
};

const ACTIVE_KEYS = ['gender', 'category', 'size', 'color', 'search', 'minPrice', 'maxPrice'];

export function ActiveFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const active = ACTIVE_KEYS
    .map((key) => ({ key, value: params.get(key) }))
    .filter((f): f is { key: string; value: string } => f.value !== null);

  if (active.length === 0) return null;

  const remove = (key: string) => {
    const p = new URLSearchParams(params.toString());
    p.delete(key);
    p.delete('page');
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium text-muted-foreground">Active:</span>
      <AnimatePresence>
        {active.map(({ key, value }) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => remove(key)}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <span className="text-primary/60">{FILTER_LABELS[key]}:</span>
            {key === 'minPrice' ? `৳${value}` : key === 'maxPrice' ? `৳${value}` : value}
            <X size={10} />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}