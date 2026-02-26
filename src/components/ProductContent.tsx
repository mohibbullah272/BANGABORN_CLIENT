'use client';

import { useState, useTransition, Suspense } from 'react';
import { IProduct } from '@/types/products';
import { ProductGrid } from './ProductGrid';
import { SearchSortBar } from './SearchSortBar';
import { ActiveFilters } from './ActiveFilter';
import { FilterSidebar } from './FilterSideBar';
import { Pagination } from './Pagination';
import { ProductGridSkeleton } from './ProductCardSkeleton';

interface ProductsContentProps {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export function ProductsContent({ products, total, page, totalPages }: ProductsContentProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isPending, startTransition] = useTransition();

  const handleViewChange = (v: 'grid' | 'list') => {
    startTransition(() => setView(v));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <Suspense fallback={null}>
          <FilterSidebar />
        </Suspense>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3">
            <Suspense fallback={null}>
              <SearchSortBar total={total} view={view} onViewChange={handleViewChange} />
              <ActiveFilters />
            </Suspense>
          </div>

          {/* Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} view={view} isPending={isPending} />
          </Suspense>

          {/* Pagination */}
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}