'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const hasMultiple = images.length > 1;

  // Custom cursor
  useEffect(() => {
    const el = mainRef.current;
    const cursor = cursorRef.current;
    if (!el || !cursor) return;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      gsap.to(cursor, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  // Thumbnail scroll into view
  useEffect(() => {
    const thumb = thumbsRef.current?.children[activeIndex] as HTMLElement;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeIndex]);

  return (
    <div className="flex gap-3 h-full">
      {/* Thumbnail strip */}
      {hasMultiple && (
        <div
          ref={thumbsRef}
          className="flex flex-col gap-2 overflow-y-auto scrollbar-none max-h-[600px] w-16 shrink-0"
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                activeIndex === i
                  ? 'border-primary shadow-md shadow-primary/20'
                  : 'border-border/40 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${name} view ${i + 1}`} fill className="object-cover" sizes="64px" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        ref={mainRef}
        onClick={() => setZoomed((z) => !z)}
        className="group relative flex-1 overflow-hidden rounded-2xl bg-muted cursor-none"
        style={{ aspectRatio: '3/4', maxHeight: '600px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex] || '/placeholder.jpg'}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-transform duration-700 ${zoomed ? 'scale-125' : 'scale-100'}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Custom cursor */}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.div
            animate={{ scale: zoomed ? 0.8 : 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/90 backdrop-blur-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-background">
              {zoomed ? 'OUT' : 'ZOOM'}
            </span>
          </motion.div>
        </div>

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute bottom-3 right-3 z-10 rounded-full bg-background/70 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-[10px] font-semibold text-foreground">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Arrow nav */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % images.length); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}