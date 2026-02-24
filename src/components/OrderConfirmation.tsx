'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Package, MapPin, Phone, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderResponse, SHIPPING_COST } from '@/types/order';

interface OrderConfirmationProps {
  open: boolean;
  onClose: () => void;
  order: OrderResponse['order'];
  productName: string;
  productPrice: number;
  quantity: number;
  isInsideDhaka: boolean;
}

export function OrderConfirmation({
  open,
  onClose,
  order,
  productName,
  productPrice,
  quantity,
  isInsideDhaka,
}: OrderConfirmationProps) {
  const shippingCost = isInsideDhaka ? SHIPPING_COST.insideDhaka : SHIPPING_COST.outsideDhaka;
  const subtotal = productPrice * quantity;
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={14} />
              </button>

              {/* Success header */}
              <div className="relative flex flex-col items-center px-6 pb-6 pt-10">
                {/* Animated rings */}
                <div className="relative mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 240, delay: 0.2 }}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 280, delay: 0.3 }}
                      >
                        <CheckCircle2 size={32} className="text-green-500" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  {/* Sparkle dots */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <motion.div
                      key={deg}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
                      className="absolute h-1.5 w-1.5 rounded-full bg-green-400"
                      style={{
                        top: `${50 + 42 * Math.sin((deg * Math.PI) / 180)}%`,
                        left: `${50 + 42 * Math.cos((deg * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-black tracking-tight text-foreground"
                >
                  Order Placed! 🎉
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-1.5 text-center text-sm text-muted-foreground"
                >
                  Thank you for shopping with{' '}
                  <span className="font-semibold text-primary">Bangaborn</span>!
                  We'll confirm your order shortly.
                </motion.p>
              </div>

              {/* Order summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mx-4 mb-4 overflow-hidden rounded-2xl border border-border/50 bg-muted/30"
              >
                {/* Product row */}
                <div className="flex items-start gap-3 border-b border-border/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Package size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {quantity} × ৳{productPrice.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>

                {/* Shipping info */}
                {order?.shippingInfo && (
                  <div className="space-y-2 border-b border-border/40 p-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {order.shippingInfo.address}, {order.shippingInfo.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="shrink-0 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{order.shippingInfo.phone}</p>
                    </div>
                  </div>
                )}

                {/* Cost breakdown */}
                <div className="space-y-1.5 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Delivery ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
                    </span>
                    <span className="font-medium text-foreground">৳{shippingCost}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
                    <span className="text-sm font-semibold text-foreground">Total</span>
                    <span className="text-base font-black text-foreground">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* COD badge */}
                <div className="flex items-center justify-center gap-2 border-t border-border/40 px-4 py-3 bg-amber-500/5">
                  <Banknote size={14} className="text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Cash on Delivery</span>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="px-4 pb-6"
              >
                <Button onClick={onClose} className="w-full rounded-xl font-bold">
                  Continue Shopping
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}