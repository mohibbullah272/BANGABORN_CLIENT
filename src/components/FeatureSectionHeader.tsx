'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export function FeaturedSectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* Left: label + heading */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          {/* Animated accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-px w-10 origin-left bg-primary"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Handpicked · Bangaborn
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          Featured
          <span className="ml-3 font-light italic text-muted-foreground">Collection</span>
        </motion.h2>
      </div>

      {/* Right: View all link */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          View All Products
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </div>
  );
}