'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { IProduct } from '@/types/products';

gsap.registerPlugin(ScrollTrigger);

interface DetailHeroProps {
  product: IProduct;
}

export function DetailHero({ product }: DetailHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.7]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // GSAP stagger entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-char',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
      gsap.fromTo(
        '.hero-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.7 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const nameChars = product.name.split('');

  return (
    <div ref={containerRef} className="relative h-[90vh] w-full overflow-hidden">
      {/* Parallax image */}
      <motion.div
        ref={imageRef}
        style={{ y: springY, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        ref={overlayRef}
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
      />

      {/* Fixed content that fades */}
      <motion.div
        ref={textRef}
        style={{ y: textY, opacity }}
        className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-12 lg:px-20"
      >
        {/* Category tag */}
        <div className="hero-meta mb-4 flex items-center gap-3">
          <div className="h-px w-12 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            {product.category} · {product.gender}
          </span>
        </div>

        {/* Animated title */}
        <h1 className="overflow-hidden">
          <span className="flex flex-wrap text-4xl font-black leading-none tracking-tighter text-white md:text-6xl lg:text-7xl xl:text-8xl">
            {nameChars.map((char, i) => (
              <span key={i} className="hero-char inline-block" style={{ opacity: 0 }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Price + rating row */}
        <div className="hero-meta mt-5 flex flex-wrap items-center gap-6">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-white md:text-3xl">
              ৳{(product.discountPrice ?? product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-base text-white/50 line-through">৳{product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-white/70">{product.rating.toFixed(1)} ({product.numReviews})</span>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="hero-meta mt-8 flex items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-8 w-5 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="h-1.5 w-0.5 rounded-full bg-white/60" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Top left breadcrumb */}
      <div className="absolute left-6 top-6 z-10 flex items-center gap-2 md:left-12 lg:left-20">
        <a href="/products" className="text-xs font-medium text-white/60 hover:text-white transition-colors">
          Products
        </a>
        <span className="text-white/30">/</span>
        <span className="text-xs font-medium text-white/90 truncate max-w-[150px]">{product.name}</span>
      </div>
    </div>
  );
}