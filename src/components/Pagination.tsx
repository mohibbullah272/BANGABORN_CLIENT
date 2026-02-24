'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set('page', String(p));
    startTransition(() => router.push(`?${sp.toString()}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-xl p-0"
      >
        <ChevronLeft size={15} />
      </Button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center gap-1.5">
            {prev && p - prev > 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <Button
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => goTo(p)}
              className={cn('h-9 w-9 rounded-xl p-0 text-xs font-semibold')}
            >
              {p}
            </Button>
          </span>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-xl p-0"
      >
        <ChevronRight size={15} />
      </Button>
    </div>
  );
}