'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight } from 'lucide-react';
import { IProduct } from '@/types/products';

interface FeaturedCardProps {
  product: IProduct;
  index: number;
}

export function FeaturedCard({ product, index }: FeaturedCardProps) {
  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${product.name}`}
      >
        {/* ── Image container ─────────────────────────── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* Product image */}
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            priority={index < 3}
          />

          {/* Subtle dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Discount pill — top left */}
          {hasDiscount && (
            <div className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-md border border-white/20">
              <span className="text-[10px] font-bold text-white">−{discountPct}%</span>
            </div>
          )}

          {/* Arrow icon — top right, reveals on hover */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <ArrowUpRight size={14} className="text-white" />
          </div>

          {/* ── Glass info card — bottom overlay ──────── */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/25">

              {/* Category tag */}
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                {product.category} · {product.gender}
              </p>

              {/* Product name */}
              <h3 className="truncate text-sm font-bold leading-tight text-white">
                {product.name}
              </h3>

              {/* Rating + price row */}
              <div className="mt-2 flex items-center justify-between gap-2">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={9}
                        className={
                          i < Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/25'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/60">({product.numReviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-white">
                    ৳{displayPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-white/45 line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}