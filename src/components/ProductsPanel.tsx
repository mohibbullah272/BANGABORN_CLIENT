'use client';

import { useState, useTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Loader2, Star, Package, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { IProduct } from '@/types/products';

import { ProductForm } from './ProductForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { deleteProduct, fetchAdminProducts } from '@/actions/Admin.action';

interface ProductsPanelProps {
  initialProducts: IProduct[];
  initialTotal: number;
}

export function ProductsPanel({ initialProducts, initialTotal }: ProductsPanelProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<IProduct | null | 'new'>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reload = useCallback((s?: string) => {
    startTransition(async () => {
      const res = await fetchAdminProducts({ limit: "50", search: s });
      if (res.success) {
        setProducts(res.products);

        setTotal(res.total);
      }
    });
  }, []);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setTotal((t) => t - 1);
        setConfirmDelete(null);
        toast.success('Product soft-deleted');
      } else {
        toast.error(res.message || 'Delete failed');
      }
    });
  };

  const handleSuccess = () => {
    setEditProduct(null);
    reload(search);
  };

  // Show form if editing/creating
  if (editProduct !== null) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            {editProduct === 'new' ? 'Create New Product' : `Edit: ${(editProduct as IProduct).name}`}
          </h3>
          <button onClick={() => setEditProduct(null)} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <ProductForm
          product={editProduct === 'new' ? undefined : (editProduct as IProduct)}
          onSuccess={handleSuccess}
          onCancel={() => setEditProduct(null)}
        />
      </div>
    );
  }

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); reload(e.target.value); }}
            className="h-9 rounded-xl pl-8 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => reload(search)} disabled={isPending} className="h-9 rounded-xl gap-1.5">
          <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} /> Refresh
        </Button>
        <Button size="sm" onClick={() => setEditProduct('new')} className="h-9 rounded-xl gap-1.5 font-bold">
          <Plus size={13} /> New Product
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {total}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Package size={32} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: i * 0.03 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Package size={24} className="text-muted-foreground/30" /></div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={() => setEditProduct(product)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 text-foreground shadow-lg hover:bg-background transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(product._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Badges */}
                {product.isFeatured && (
                  <div className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                    ★ Featured
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2 py-0.5 text-[9px] font-bold text-white">
                    Inactive
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-muted-foreground">{product.category} · {product.gender}</p>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-muted-foreground">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="truncate text-sm font-bold text-foreground">{product.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-foreground">
                      ৳{(product.discountPrice ?? product.price).toLocaleString()}
                    </span>
                    {product.discountPrice && (
                      <span className="text-[11px] text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
                    )}
                  </div>
                  <span className={cn('text-[10px] font-semibold', product.stock < 5 ? 'text-destructive' : 'text-muted-foreground')}>
                    {product.stock} left
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 mb-4">
                <Trash2 size={20} className="text-destructive" />
              </div>
              <h3 className="text-base font-bold text-foreground">Delete Product?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">This will soft-delete the product. It won't appear in listings but data is preserved.</p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl" disabled={isPending}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(confirmDelete!)} className="flex-1 rounded-xl" disabled={isPending}>
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}