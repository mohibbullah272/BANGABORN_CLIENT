'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types/products';
import { useState } from 'react';

interface ProductCardProps {
  product: IProduct;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [wished, setWished] = useState(false);

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice ?? product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.images[imgIndex] || '/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 4}
        />

        {/* Hover second image */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
   
          {product.stock === 0 && (
            <Badge variant="secondary" className="text-[10px]">
              Out of Stock
            </Badge>
          )}
        </div>

    

        {/* Size dots on hover */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {product.sizes.slice(0, 5).map((size) => (
            <span key={size} className="rounded bg-background/90 px-1.5 py-0.5 text-[9px] font-semibold text-foreground backdrop-blur-sm">
              {size}
            </span>
          ))}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {product.category} · {product.gender}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground transition-colors hover:text-primary">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({product.numReviews})</span>
        </div>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                title={color}
                className="h-3.5 w-3.5 rounded-full border border-border ring-offset-background transition-transform hover:scale-125"
                style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">৳{displayPrice.toLocaleString()}</span>
    
          </div>
        </div>
      </div>
    </motion.div>
  );
}