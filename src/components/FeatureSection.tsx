import { Suspense } from 'react';
import { FeaturedGridSkeleton } from './FeatureCardSkeleton';
import { FeaturedSectionHeader } from './FeatureSectionHeader';
import { FeaturedGrid } from './FeatureGrid';
import { fetchFeaturedProducts } from '@/actions/Featured.action';


async function FeaturedContent() {
  const data = await fetchFeaturedProducts(6).catch(() => ({
    success: false,
    count: 0,
    products: [],
  }));

  return (
    <>
      <FeaturedSectionHeader />
      <FeaturedGrid products={data.products} />
    </>
  );
}

export function FeaturedSection() {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24">
      {/* Subtle ambient glow behind the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 h-[600px] w-full"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, hsl(var(--primary)/0.06) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <>
              {/* Skeleton header */}
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-36 animate-pulse rounded-xl bg-muted" />
              </div>
              <FeaturedGridSkeleton />
            </>
          }
        >
          <FeaturedContent />
        </Suspense>
      </div>
    </section>
  );
}