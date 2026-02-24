// next/types/app/products/page.tsx (edited)
// @ts-nocheck
import { Suspense } from 'react';
import { fetchProducts } from '@/actions/product.action';
import { ProductsPageHeader } from '@/components/ProductsPageHeader';
import { ProductsContent } from '@/components/ProductContent';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { ProductQuery } from '@/types/products';

interface ProductsPageProps {
  // allow searchParams to be either the plain object or a Promise of it
  searchParams: ProductQuery | Promise<ProductQuery>;
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // resolve if it's a Promise
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const query: ProductQuery = {
    page: resolvedSearchParams.page || '1',
    limit: resolvedSearchParams.limit || '12',
    sortBy: resolvedSearchParams.sortBy || 'createdAt',
    sortOrder: resolvedSearchParams.sortOrder || 'desc',
    category: resolvedSearchParams.category,
    gender: resolvedSearchParams.gender,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    size: resolvedSearchParams.size,
    color: resolvedSearchParams.color,
    search: resolvedSearchParams.search,
  };

  const data = await fetchProducts(query).catch(() => ({
    success: false,
    products: [],
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 12,
  }));

  return (
    <AnimatedBackground>
      <ProductsPageHeader />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <ProductGridSkeleton count={12} />
          </div>
        }
      >
        <ProductsContent
          products={data.products}
          total={data.total}
          page={data.page}
          totalPages={data.totalPages}
        />
      </Suspense>
    </AnimatedBackground>
  );
}