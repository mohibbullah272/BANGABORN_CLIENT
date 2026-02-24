import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <Skeleton className="h-[90vh] w-full rounded-none" />

      {/* Detail section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-xl" />
              ))}
            </div>
            <Skeleton className="flex-1 rounded-2xl" style={{ aspectRatio: '3/4', maxHeight: 600 }} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-px w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-12 rounded-xl" />
              ))}
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}