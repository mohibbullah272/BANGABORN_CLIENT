export function FeaturedCardSkeleton() {
    return (
      <div className="flex flex-col overflow-hidden rounded-2xl bg-muted animate-pulse">
        <div className="aspect-[3/4] w-full bg-muted-foreground/10" />
      </div>
    );
  }
  
  export function FeaturedGridSkeleton() {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FeaturedCardSkeleton key={i} />
        ))}
      </div>
    );
  }