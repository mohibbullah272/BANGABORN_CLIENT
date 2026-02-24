'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingBag, Heart, Share2, Check, ChevronDown,
  Package, Truck, RefreshCw, Shield, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IProduct } from '@/types/products';
import { OrderResponse } from '@/types/order';
import { cn } from '@/lib/utils';
import { OrderFormDialog } from './OrderFormDialog';
import { OrderConfirmation } from './OrderConfirmation';
import { Toaster } from 'sonner';

interface ProductInfoPanelProps {
  product: IProduct;
}

const PROMISES = [
  { icon: RefreshCw, label: '7-day easy returns' },
  { icon: Shield, label: 'Authentic guarantee' },
  { icon: Package, label: 'Secure packaging' },
];

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] ?? null);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Direct order state
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderResponse['order'] | null>(null);
  const [orderInsideDhaka, setOrderInsideDhaka] = useState(true);

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = product.discountPrice ?? product.price;
  const inStock = product.stock > 0;

  const requireSize = (): boolean => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1200);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    if (!requireSize()) return;
    setOrderFormOpen(true);
  };

  const handleOrderSuccess = (order: OrderResponse['order'], isInsideDhaka: boolean) => {
    setCompletedOrder(order);
    setOrderInsideDhaka(isInsideDhaka);
    setConfirmationOpen(true);
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      <OrderFormDialog
        open={orderFormOpen}
        onClose={() => setOrderFormOpen(false)}
        product={product}
        selectedSize={selectedSize ?? ''}
        selectedColor={selectedColor ?? ''}
        quantity={qty}
        onSuccess={handleOrderSuccess}
      />

      {completedOrder && (
        <OrderConfirmation
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          order={completedOrder}
          productName={product.name}
          productPrice={displayPrice}
          quantity={qty}
          isInsideDhaka={orderInsideDhaka}
        />
      )}

      <div className="flex flex-col gap-5">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-md text-[10px] font-semibold uppercase tracking-widest">
            {product.category}
          </Badge>
          <Badge variant="outline" className="rounded-md text-[10px] font-medium">
            {product.gender}
          </Badge>
          {product.isFeatured && (
            <Badge className="rounded-md bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px] font-semibold">
              ★ Featured
            </Badge>
          )}
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground lg:text-4xl">
            {product.name}
          </h1>
          {product.material && (
            <p className="mt-1.5 text-sm text-muted-foreground">{product.material}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/25'}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({product.numReviews} reviews)</span>
          <span className="ml-1 text-xs text-muted-foreground">· {product.sold} sold</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-foreground tracking-tight">
            ৳{displayPrice.toLocaleString()}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
              <span className="rounded-lg bg-green-500/15 px-2 py-0.5 text-sm font-bold text-green-600">
                -{discountPct}%
              </span>
            </>
          )}
        </div>

        <div className="h-px bg-border/50" />

        {/* Color */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Color</span>
            {selectedColor && <span className="text-xs font-medium text-muted-foreground">{selectedColor}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={cn(
                  'relative h-8 w-8 rounded-full border-2 transition-all',
                  selectedColor === color
                    ? 'border-foreground ring-2 ring-foreground/20'
                    : 'border-transparent hover:border-foreground/30'
                )}
                style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '') }}
              >
                {selectedColor === color && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                    <Check size={12} className="text-white drop-shadow" />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className={cn('text-xs font-semibold uppercase tracking-widest', sizeError ? 'text-destructive' : 'text-foreground/70')}>
              {sizeError ? '⚠ Please select a size' : 'Size'}
            </span>
            <button className="text-[11px] text-primary underline underline-offset-2 hover:no-underline">Size guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedSize(size); setSizeError(false); }}
                className={cn(
                  'min-w-[44px] rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
                  selectedSize === size
                    ? 'border-foreground bg-foreground text-background'
                    : sizeError
                    ? 'border-destructive/50 text-muted-foreground hover:border-destructive'
                    : 'border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                )}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <span className="mb-2.5 block text-xs font-semibold uppercase tracking-widest text-foreground/70">Quantity</span>
          <div className="flex items-center gap-0 rounded-xl border border-border w-fit overflow-hidden">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">−</button>
            <span className="w-10 text-center text-sm font-semibold text-foreground">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex h-10 w-10 items-center justify-center text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">+</button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>

        {/* ─── CTA BUTTONS ─── */}
        <div className="flex flex-col gap-2.5">
          {/* Primary: Direct Order (COD) */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleOrderNow}
              disabled={!inStock}
              size="lg"
              className="w-full h-13 rounded-xl text-sm font-black tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-shadow"
            >
              <Zap size={16} className="mr-2 shrink-0" />
              Order Now · Cash on Delivery
            </Button>
          </motion.div>

    
        </div>

        {/* Delivery info pill */}
        <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
          <Truck size={14} className="shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            Delivery: <strong className="text-foreground">৳70 inside Dhaka</strong> · <strong className="text-foreground">৳120 outside Dhaka</strong>. Cash on delivery — pay when you receive.
          </p>
        </div>

        {/* Promises grid */}
        <div className="grid grid-cols-2 gap-2">
          {PROMISES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5">
              <Icon size={13} className="shrink-0 text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Description accordion */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <button
            onClick={() => setDescOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
          >
            Description
            <ChevronDown size={15} className={cn('text-muted-foreground transition-transform duration-300', descOpen && 'rotate-180')} />
          </button>
          <AnimatePresence initial={false}>
            {descOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}