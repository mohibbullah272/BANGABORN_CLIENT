'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IProduct } from '@/types/products';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductInfoPanel } from './ProductInfoPanel';

gsap.registerPlugin(ScrollTrigger);

interface DetailStickyProps {
  product: IProduct;
}

export function DetailSticky({ product }: DetailStickyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal the info panel children on scroll into view
      ScrollTrigger.create({
        trigger: infoRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            infoRef.current?.children ?? [],
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: 'power2.out' }
          );
        },
        once: true,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12 flex items-center gap-4"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Details</span>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <ProductImageGallery images={product.images} name={product.name} />
        </motion.div>

        {/* Info panel */}
        <div ref={infoRef}>
          <ProductInfoPanel product={product} />
        </div>
      </div>
    </section>
  );
}