'use client';

import { useState, useTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Trash2, Loader2, MapPin, Phone, Package, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IOrder } from '@/types/admin';

import { OrderStatusBadge, STATUS_CONFIG } from './OrderStatusBadge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { cancelOrder, fetchAdminOrders, updateOrderStatus } from '@/actions/Admin.action';
import Image from 'next/image';

interface OrdersPanelProps {
  initialOrders: IOrder[];
  initialTotal: number;
}

const ORDER_STATUSES = ['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrdersPanel({ initialOrders, initialTotal }: OrdersPanelProps) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [total, setTotal] = useState(initialTotal);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reload = useCallback((status: string) => {
    startTransition(async () => {
      const res = await fetchAdminOrders({ limit: 50, status });
      if (res.success) {
        setOrders(res.orders);
        setTotal(res.total);
       
      }
    });
  }, []);

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(id, status);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: status as IOrder['status'] } : o)));
        toast.success(`Order status updated to ${status}`);
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    });
  };

  const handleCancel = (id: string) => {
    startTransition(async () => {
      const res = await cancelOrder(id);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        setTotal((t) => t - 1);
        toast.success('Order cancelled and stock restored');
      } else {
        toast.error(res.message || 'Failed to cancel order');
      }
    });
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.shippingInfo.name.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingInfo.phone.includes(search) ||
      o._id.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl pl-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); reload(v); }}>
          <SelectTrigger className="h-9 w-40 rounded-xl text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => reload(statusFilter)} disabled={isPending} className="h-9 rounded-xl gap-1.5">
          <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} />
          Refresh
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {total}</span>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package size={32} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((order, i) => {
            const expanded = expandedId === order._id;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={cn(
                  'overflow-hidden rounded-2xl border transition-all',
                  expanded ? 'border-primary/30 bg-primary/[0.02]' : 'border-border/50 bg-card hover:border-border'
                )}
              >
                {/* Row header */}
                <div
                  className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3.5"
                  onClick={() => setExpandedId(expanded ? null : order._id)}
                >
                  {/* ID */}
                  <span className="font-mono text-[10px] text-muted-foreground min-w-[80px]">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>

                  {/* Customer */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{order.shippingInfo.name}</p>
                    <p className="text-[10px] text-muted-foreground">{order.shippingInfo.city} · {order.shippingInfo.phone}</p>
                  </div>

                  {/* Amount */}
                  <span className="text-sm font-black text-foreground">
                    ৳{order.total}
                  </span>

                  {/* Status badge */}
                  <OrderStatusBadge status={order.status} />

                  {/* Date */}
                  <span className="hidden text-[10px] text-muted-foreground sm:block">
                    {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                  </span>

                  <ChevronDown size={14} className={cn('text-muted-foreground transition-transform', expanded && 'rotate-180')} />
                </div>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-4">
                        {/* Shipping info */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-1.5">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Shipping</p>
                            <div className="flex items-start gap-1.5">
                              <MapPin size={11} className="mt-0.5 shrink-0 text-muted-foreground" />
                              <p className="text-xs text-foreground">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone size={11} className="shrink-0 text-muted-foreground" />
                              <p className="text-xs text-foreground">{order.shippingInfo.phone}</p>
                            </div>
                            <span className={cn('inline-block rounded-full px-2 py-0.5 text-[9px] font-bold', order.shippingInfo.isInsideDhaka ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600')}>
                              {order.shippingInfo.isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'} · ৳{order.deliveryCharge}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-1.5">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Items ({order.items.length})</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 flex-col text-xs">
                                       <span className="text-foreground font-medium">
                         {item.name} - {item.price}tk
                                </span>
                                <span className="text-foreground font-medium">
                             Ordered ( {item.size} ) Size
                                </span>
                                <span className="text-foreground font-medium">
                           Quantity : {item.quantity}
                                </span>
                                <div className='flex gap-3'>
                                  
                                <span className="text-foreground font-medium">
                           Color : {item.color}
                                </span>

                                <span
                key={item.color}
                title={item.color}
                className="h-4 w-4 rounded-full border border-border ring-offset-background transition-transform hover:scale-125"
                style={{ backgroundColor: item.color.toLowerCase().replace(/\s/g, '') }}
              />
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  <Image
                                  src={item.image as string}
                                  alt="product_image"
                                  width={200}
                                  height={50}
                                  className='rounded-xl'
                                  />
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-border/40 pt-1.5 flex justify-between text-xs font-black">
                              <span>Subtotal</span>
                              <span>৳{order.subtotal}</span>
                            </div>
                            <div className="border-t border-border/40 pt-1.5 flex justify-between text-xs font-black">
                              <span>Total</span>
                              <span>৳{order.total}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status update + actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order._id, v)}
                            disabled={isPending}
                          >
                            <SelectTrigger className="h-8 w-40 rounded-xl text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(STATUS_CONFIG).map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isPending || order.status === 'Cancelled'}
                            onClick={() => handleCancel(order._id)}
                            className="h-8 rounded-xl gap-1.5 text-xs"
                          >
                            {isPending ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            Cancel Order
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}