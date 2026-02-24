'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, GENDERS, SIZES } from '@/types/products';
import { cn } from '@/lib/utils';

interface FilterSection {
  key: string;
  label: string;
}

const sections: FilterSection[] = [
  { key: 'gender', label: 'Gender' },
  { key: 'category', label: 'Category' },
  { key: 'size', label: 'Size' },
  { key: 'price', label: 'Price Range' },
];

export function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<Record<string, boolean>>({
    gender: true, category: true, size: true, price: true,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(params.get('minPrice') || 0),
    Number(params.get('maxPrice') || 10000),
  ]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = ['gender', 'category', 'size', 'minPrice', 'maxPrice', 'color']
    .filter((k) => params.get(k)).length;

  const updateFilter = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (value === null || value === p.get(key)) {
      p.delete(key);
    } else {
      p.set(key, value);
    }
    p.delete('page');
    router.push(`?${p.toString()}`);
  }, [params, router]);

  const applyPrice = useCallback(() => {
    const p = new URLSearchParams(params.toString());
    p.set('minPrice', String(priceRange[0]));
    p.set('maxPrice', String(priceRange[1]));
    p.delete('page');
    router.push(`?${p.toString()}`);
  }, [params, priceRange, router]);

  const clearAll = useCallback(() => {
    router.push('?');
    setPriceRange([0, 10000]);
  }, [router]);

  const FilterContent = () => (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Filters</span>
          {activeCount > 0 && (
            <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-destructive">
            <X size={10} /> Clear all
          </button>
        )}
      </div>

      {sections.map((section) => (
        <div key={section.key} className="border-t border-border/50 py-3">
          <button
            onClick={() => setOpen((o) => ({ ...o, [section.key]: !o[section.key] }))}
            className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            {section.label}
            <ChevronDown
              size={13}
              className={cn('transition-transform', open[section.key] && 'rotate-180')}
            />
          </button>

          <AnimatePresence initial={false}>
            {open[section.key] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  {section.key === 'gender' && (
                    <div className="flex flex-wrap gap-1.5">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          onClick={() => updateFilter('gender', g)}
                          className={cn(
                            'rounded-lg border px-3 py-1 text-[11px] font-medium transition-all',
                            params.get('gender') === g
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}

                  {section.key === 'category' && (
                    <div className="flex flex-col gap-1">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => updateFilter('category', c)}
                          className={cn(
                            'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                            params.get('category') === c
                              ? 'bg-primary/10 font-semibold text-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          {c}
                          {params.get('category') === c && <X size={10} />}
                        </button>
                      ))}
                    </div>
                  )}

                  {section.key === 'size' && (
                    <div className="flex flex-wrap gap-1.5">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateFilter('size', s)}
                          className={cn(
                            'h-8 w-10 rounded-lg border text-[11px] font-semibold transition-all',
                            params.get('size') === s
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-muted-foreground hover:border-primary/50'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {section.key === 'price' && (
                    <div className="flex flex-col gap-3 px-1">
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(v) => setPriceRange(v as [number, number])}
                        className="mt-1"
                      />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-foreground">৳{priceRange[0].toLocaleString()}</span>
                        <span className="font-medium text-foreground">৳{priceRange[1].toLocaleString()}</span>
                      </div>
                      <Button onClick={applyPrice} size="sm" className="h-7 text-xs">
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-2 rounded-xl"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && <Badge className="h-4 min-w-4 rounded-full px-1 text-[9px]">{activeCount}</Badge>}
        </Button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-card p-5 shadow-2xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-bold">Filters</span>
                  <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 hover:bg-muted">
                    <X size={18} />
                  </button>
                </div>
                <FilterContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}