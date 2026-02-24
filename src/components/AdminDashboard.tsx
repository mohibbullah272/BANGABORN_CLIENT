'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminStatsBar } from './AdminStatsBar';
import { OrdersPanel } from './OrdersPanel';
import { ProductsPanel } from './ProductsPanel';

import { IOrder } from '@/types/admin';
import { IProduct } from '@/types/products';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { adminLogout } from '@/actions/Admin.action';

type Tab = 'orders' | 'products';

interface AdminDashboardProps {
  orders: IOrder[];
  ordersTotal: number;
  products: IProduct[];
  productsTotal: number;
  adminEmail: string;
}

export function AdminDashboard({
  orders,
  ordersTotal,
  products,
  productsTotal,
  adminEmail,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('orders');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      router.replace('/admin/web-management/login');
      router.refresh();
    });
  };

  const TABS: Array<{ key: Tab; label: string; icon: typeof ShoppingBag; count?: number }> = [
    { key: 'orders', label: 'Orders', icon: ShoppingBag, count: ordersTotal },
    { key: 'products', label: 'Products', icon: Package, count: productsTotal },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="min-h-screen bg-background">
        {/* ── TOP NAV BAR ─────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">B</div>
              <div>
                <p className="text-sm font-black tracking-tight text-foreground leading-none">Bangaborn</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Management</p>
              </div>
            </div>

            {/* Tab switcher — pill style */}
            <div className="flex items-center gap-0.5 rounded-xl border border-border/60 bg-muted/40 p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    tab === t.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <t.icon size={13} />
                  {t.label}
                  {t.count !== undefined && (
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold', tab === t.key ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/15 text-muted-foreground')}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-muted-foreground sm:block truncate max-w-[140px]">{adminEmail}</span>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-50"
                title="Logout"
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
              </button>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ───────────────────────────────── */}
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
          {/* Stats bar */}
          <AdminStatsBar
            totalOrders={ordersTotal}
            pendingOrders={pendingOrders}
            deliveredOrders={deliveredOrders}
            totalProducts={productsTotal}
          />

          {/* Panel card */}
          <div className="rounded-3xl border border-border/50 bg-card shadow-sm">
            {/* Panel header */}
            <div className="border-b border-border/50 px-5 py-4">
              <div className="flex items-center gap-2">
                {tab === 'orders' ? <ShoppingBag size={16} className="text-primary" /> : <Package size={16} className="text-primary" />}
                <h2 className="text-base font-black text-foreground">
                  {tab === 'orders' ? 'Order Management' : 'Product Management'}
                </h2>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {tab === 'orders' ? ordersTotal : productsTotal}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {tab === 'orders'
                  ? 'View, update status, and manage all customer orders'
                  : 'Create, edit, and delete products with image management'}
              </p>
            </div>

            {/* Panel content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === 'orders' ? (
                    <OrdersPanel initialOrders={orders} initialTotal={ordersTotal} />
                  ) : (
                    <ProductsPanel initialProducts={products} initialTotal={productsTotal} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <p className="pb-6 text-center text-[10px] text-muted-foreground">
            Bangaborn Internal Management · {new Date().getFullYear()}
          </p>
        </main>
      </div>
    </>
  );
}