'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Shape {
  id: number;
  x: string;
  y: string;
  size: number;
  type: 'circle' | 'square' | 'triangle' | 'ring';
  delay: number;
  duration: number;
  opacity: number;
}

const shapes: Shape[] = [
  { id: 1, x: '8%', y: '10%', size: 120, type: 'ring', delay: 0, duration: 20, opacity: 0.06 },
  { id: 2, x: '85%', y: '5%', size: 80, type: 'circle', delay: 2, duration: 15, opacity: 0.08 },
  { id: 3, x: '70%', y: '25%', size: 200, type: 'ring', delay: 1, duration: 25, opacity: 0.04 },
  { id: 4, x: '15%', y: '40%', size: 60, type: 'square', delay: 3, duration: 18, opacity: 0.07 },
  { id: 5, x: '90%', y: '50%', size: 140, type: 'ring', delay: 0.5, duration: 22, opacity: 0.05 },
  { id: 6, x: '5%', y: '70%', size: 100, type: 'circle', delay: 1.5, duration: 17, opacity: 0.06 },
  { id: 7, x: '50%', y: '80%', size: 170, type: 'ring', delay: 2.5, duration: 28, opacity: 0.04 },
  { id: 8, x: '80%', y: '85%', size: 90, type: 'square', delay: 0.8, duration: 20, opacity: 0.07 },
  { id: 9, x: '35%', y: '15%', size: 55, type: 'circle', delay: 3.5, duration: 14, opacity: 0.09 },
  { id: 10, x: '60%', y: '60%', size: 130, type: 'ring', delay: 1.2, duration: 24, opacity: 0.05 },
];

function ShapeEl({ shape }: { shape: Shape }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: '+=40',
      x: '+=20',
      rotation: shape.type === 'square' ? 45 : 0,
      duration: shape.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: shape.delay,
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.to(ref.current, {
          y: `+=${self.progress * 60}`,
          duration: 0.5,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      },
    });
  }, [shape]);

  const baseStyle = {
    position: 'absolute' as const,
    left: shape.x,
    top: shape.y,
    opacity: shape.opacity,
    pointerEvents: 'none' as const,
  };

  if (shape.type === 'ring') {
    return (
      <svg ref={ref} style={baseStyle} width={shape.size} height={shape.size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" />
      </svg>
    );
  }

  if (shape.type === 'circle') {
    return (
      <svg ref={ref} style={baseStyle} width={shape.size} height={shape.size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))" />
      </svg>
    );
  }

  if (shape.type === 'square') {
    return (
      <svg ref={ref} style={baseStyle} width={shape.size} height={shape.size} viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" transform="rotate(15 50 50)" />
      </svg>
    );
  }

  return null;
}

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [0.03, 0.015]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Grid overlay */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: gridOpacity }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/5 dark:bg-amber-300/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' ,delay:2}}
        />
        <motion.div
          className="absolute -right-32 top-1/3 h-80 w-80 rounded-full dark:bg-sky-300/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 dark:bg-lime-300/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 25, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        />
      </div>

      {/* Geometric shapes */}
      <div className="pointer-events-none fixed inset-0  overflow-hidden">
        {shapes.map((shape) => (
          <ShapeEl key={shape.id} shape={shape} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}