'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle } from 'lucide-react';

interface StatsBarProps {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
}



export function AdminStatsBar({ totalOrders, pendingOrders, deliveredOrders, totalProducts }: StatsBarProps) {
  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: totalOrders, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Clock, label: 'Pending', value: pendingOrders, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: CheckCircle, label: 'Delivered', value: deliveredOrders, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Package, label: 'Products', value: totalProducts, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          initial="hidden"
          animate="visible"
         
          className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3.5"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
            <stat.icon size={16} className={stat.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
            <p className="text-xl font-black tracking-tight text-foreground">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}