'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useRef, useEffect } from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SORT_OPTIONS } from '@/types/products';
import { cn } from '@/lib/utils';

interface SearchSortBarProps {
  total: number;
  view: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
}

export function SearchSortBar({ total, view, onViewChange }: SearchSortBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  // @ts-ignore
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const currentSort = `${params.get('sortBy') || 'createdAt'}-${params.get('sortOrder') || 'desc'}`;

  const handleSearch = useCallback((value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const p = new URLSearchParams(params.toString());
      if (value) {
        p.set('search', value);
      } else {
        p.delete('search');
      }
      p.delete('page');
      startTransition(() => router.push(`?${p.toString()}`));
    }, 400);
  }, [params, router]);

  const handleSort = useCallback((value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    const p = new URLSearchParams(params.toString());
    p.set('sortBy', sortBy);
    p.set('sortOrder', sortOrder);
    p.delete('page');
    startTransition(() => router.push(`?${p.toString()}`));
  }, [params, router]);

  const clearSearch = useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
    const p = new URLSearchParams(params.toString());
    p.delete('search');
    router.push(`?${p.toString()}`);
  }, [params, router]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48 max-w-sm">
        <Search
          size={14}
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors',
            isPending && 'text-primary animate-pulse'
          )}
        />
        <Input
          ref={inputRef}
          defaultValue={params.get('search') ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products…"
          className="h-9 rounded-xl pl-9 pr-8 text-sm"
        />
        {params.get('search') && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
      </div>



      <div className="ml-auto flex items-center gap-2">
        {/* Sort */}
        <Select value={currentSort} onValueChange={handleSort}>
          <SelectTrigger className="h-9 w-48 rounded-xl text-xs">
            <ArrowUpDown size={12} className="mr-1.5 shrink-0 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={`${opt.value}-${opt.order}`} value={`${opt.value}-${opt.order}`} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('grid')}
            className={cn('h-9 w-9 rounded-none p-0', view === 'grid' && 'bg-muted')}
          >
            <LayoutGrid size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('list')}
            className={cn('h-9 w-9 rounded-none p-0', view === 'list' && 'bg-muted')}
          >
            <List size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}