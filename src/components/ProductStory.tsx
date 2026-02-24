'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IProduct } from '@/types/products';

gsap.registerPlugin(ScrollTrigger);

interface ProductStoryProps {
  product: IProduct;
}

export function ProductStory({ product }: ProductStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  // Word-by-word reveal
  useEffect(() => {
    if (!wordsRef.current) return;
    const words = wordsRef.current.querySelectorAll('.story-word');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.1, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wordsRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const descWords = product.description.split(' ');

  return (
    <section ref={containerRef} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="lg:sticky lg:top-28">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">About</span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground md:text-3xl">
              The Story
            </h2>
            <div className="mt-4 h-12 w-0.5 bg-gradient-to-b from-primary to-transparent" />
            <div className="mt-6 flex flex-col gap-3">
              {[
                ['Category', product.category],
                ['Gender', product.gender],
                product.material ? ['Material', product.material] : null,
                ['In Stock', product.stock > 0 ? 'Yes' : 'No'],
                // @ts-ignore
              ].filter(Boolean).map(([label, val]) => (
                <div key={label as string}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right description */}
        <div className="lg:col-span-9">
          <div ref={wordsRef} className="text-2xl font-medium leading-relaxed tracking-tight text-foreground/80 md:text-3xl lg:text-4xl">
            {descWords.map((word, i) => (
              <span key={i} className="story-word inline-block" style={{ opacity: 0.1 }}>
                {word}
                {i < descWords.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}