'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';


gsap.registerPlugin();

export function ProductsPageHeader() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className="relative pb-8 pt-16 text-center">
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto mb-6 h-px w-32 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary"
      >
        Bangaborn Collection
      </motion.p>

      <motion.h1
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        Our Products
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-4 max-w-md text-sm text-muted-foreground"
      >
        Handcrafted clothing rooted in Bangladeshi heritage, designed for the modern wardrobe.
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto mt-6 h-px w-32 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </div>
  );
}