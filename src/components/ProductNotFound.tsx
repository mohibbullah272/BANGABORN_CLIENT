import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react';

export function ProductNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-muted">
        <PackageX size={36} className="text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">This product may have been removed or the link is invalid.</p>
      </div>
      <Button asChild>
        <Link href="/products">Browse All Products</Link>
      </Button>
    </div>
  );
}