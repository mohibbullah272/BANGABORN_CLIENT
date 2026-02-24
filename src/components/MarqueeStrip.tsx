'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface MarqueeStripProps {
  tags: string[];
  category: string;
  gender: string;
}

export function MarqueeStrip({ tags, category, gender }: MarqueeStripProps) {
  const items = [
    category,
    gender,
    'Bangaborn',
    'হাতে তৈরি',
    ...tags,
    '৳ Free Shipping',
    'Authentic',
  ].filter(Boolean);

  const doubled = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-border/50 bg-primary/5 py-3.5">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-primary/50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}