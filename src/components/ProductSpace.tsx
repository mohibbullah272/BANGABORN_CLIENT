'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IProduct } from '@/types/products';

interface ProductSpecsProps {
  product: IProduct;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  const specs: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'SKU / Slug', value: <span className="font-mono text-xs">{product.slug}</span> },
    { label: 'Category', value: product.category },
    { label: 'Gender', value: product.gender },
    product.material ? { label: 'Material', value: product.material } : null,
    {
      label: 'Available Sizes',
      value: (
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <span key={s} className="rounded-lg border border-border bg-muted px-2 py-0.5 text-xs font-semibold">{s}</span>
          ))}
        </div>
      ),
    },
    {
      label: 'Available Colors',
      value: (
        <div className="flex flex-wrap items-center gap-2">
          {product.colors.map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <span
                className="inline-block h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: c.toLowerCase().replace(/\s+/g, '') }}
              />
              <span className="text-xs">{c}</span>
            </div>
          ))}
        </div>
      ),
    },
    { label: 'Stock', value: `${product.stock} units available` },
    { label: 'Total Sold', value: `${product.sold} units` },
    { label: 'Rating', value: `${product.rating.toFixed(1)} / 5 (${product.numReviews} reviews)` },
    {
      label: 'Tags',
      value: product.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              #{tag}
            </span>
          ))}
        </div>
      ) : '—',
    },
  ].filter(Boolean) as Array<{ label: string; value: React.ReactNode }>;

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-center gap-4"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Specifications</span>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-border/50">
        {specs.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col gap-2 border-b border-border/40 px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:gap-6"
          >
            <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {spec.label}
            </span>
            <div className="text-sm text-foreground">{spec.value}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}