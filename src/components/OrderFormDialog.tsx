'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MapPin, Phone, User, Home, Banknote, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IProduct } from '@/types/products';
import { CreateOrderPayload, OrderResponse, SHIPPING_COST } from '@/types/order';

import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createOrder } from '@/actions/order.action';

interface OrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  product: IProduct;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSuccess: (order: OrderResponse['order'], isInsideDhaka: boolean) => void;
}

interface FormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  isInsideDhaka: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Full name is required';
  if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid BD phone number';
  if (!form.address.trim() || form.address.trim().length < 10) errors.address = 'Please enter a complete address';
  if (!form.city.trim()) errors.city = 'City is required';
  return errors;
}

export function OrderFormDialog({
  open,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
  onSuccess,
}: OrderFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    city: '',
    isInsideDhaka: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const displayPrice = product.discountPrice ?? product.price;
  const shippingCost = form.isInsideDhaka ? SHIPPING_COST.insideDhaka : SHIPPING_COST.outsideDhaka;
  const subtotal = displayPrice * quantity;
  const total = subtotal + shippingCost;

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    const payload: CreateOrderPayload = {
      shippingInfo: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        isInsideDhaka: form.isInsideDhaka,
      },
      items: [
        {
          productId: product._id,
          size: selectedSize,
          color: selectedColor,
          quantity,
        },
      ],
    };

    startTransition(async () => {
      try {
        const res = await createOrder(payload);
        onClose();
        onSuccess(res.order, form.isInsideDhaka);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to place order.';
        toast.error(message);
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isPending ? onClose : undefined}
            className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-[55] flex w-full max-w-md flex-col bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
              <div>
                <h2 className="text-lg font-black tracking-tight text-foreground">Place Order</h2>
                <p className="text-[11px] text-muted-foreground">Cash on Delivery · No advance payment</p>
              </div>
              <button
                onClick={!isPending ? onClose : undefined}
                disabled={isPending}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Order summary card */}
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Summary</p>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-lg">👕</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: <strong>{selectedSize}</strong> · Color: <strong>{selectedColor}</strong> · Qty: <strong>{quantity}</strong>
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">৳{(displayPrice * quantity).toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery zone */}
              <div>
                <Label className="mb-2.5 block text-xs font-semibold uppercase tracking-widest text-foreground/70">
                  Delivery Zone
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Inside Dhaka', value: true, cost: SHIPPING_COST.insideDhaka },
                    { label: 'Outside Dhaka', value: false, cost: SHIPPING_COST.outsideDhaka },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => set('isInsideDhaka', opt.value)}
                      className={cn(
                        'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                        form.isInsideDhaka === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className="text-xs font-semibold text-foreground">{opt.label}</span>
                      <span className={cn('mt-0.5 text-[11px] font-bold', form.isInsideDhaka === opt.value ? 'text-primary' : 'text-muted-foreground')}>
                        ৳{opt.cost} delivery
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping Details</p>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="order-name" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <User size={11} /> Full Name
                  </Label>
                  <Input
                    id="order-name"
                    placeholder="e.g. Rahim Khan"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={cn('rounded-xl text-sm h-11', errors.name && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="order-phone" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <Phone size={11} /> Phone Number
                  </Label>
                  <Input
                    id="order-phone"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    type="tel"
                    className={cn('rounded-xl text-sm h-11', errors.phone && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle size={10} /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="order-address" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <Home size={11} /> Full Address
                  </Label>
                  <Input
                    id="order-address"
                    placeholder="House, Road, Area..."
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    className={cn('rounded-xl text-sm h-11', errors.address && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.address && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle size={10} /> {errors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label htmlFor="order-city" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <MapPin size={11} /> City / District
                  </Label>
                  <Input
                    id="order-city"
                    placeholder="e.g. Dhaka, Chittagong..."
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={cn('rounded-xl text-sm h-11', errors.city && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {errors.city && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle size={10} /> {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Truck size={10} />
                    Delivery ({form.isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span className="font-medium text-foreground">৳{shippingCost}</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-base font-black text-primary">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* COD notice */}
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <Banknote size={16} className="shrink-0 text-amber-600" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Cash on Delivery.</strong> Pay ৳{total.toLocaleString()} when you receive your order. No advance required.
                </p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border/50 px-6 py-4">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="h-12 w-full rounded-xl text-sm font-black tracking-wide"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Placing Order…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Banknote size={16} /> Confirm Order · ৳{total.toLocaleString()}
                  </span>
                )}
              </Button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                By ordering you agree to our terms. Free cancellation before dispatch.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}