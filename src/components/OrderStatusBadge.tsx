import { cn } from '@/lib/utils';

type Status = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const STATUS_CONFIG: Record<Status, { label: string; classes: string; dot: string }> = {
  Pending:    { label: 'Pending',    classes: 'bg-amber-500/12 text-amber-600 border-amber-500/25',     dot: 'bg-amber-500' },
  Confirmed:  { label: 'Confirmed',  classes: 'bg-blue-500/12 text-blue-600 border-blue-500/25',         dot: 'bg-blue-500' },
  Processing: { label: 'Processing', classes: 'bg-violet-500/12 text-violet-600 border-violet-500/25',   dot: 'bg-violet-500' },
  Shipped:    { label: 'Shipped',    classes: 'bg-cyan-500/12 text-cyan-600 border-cyan-500/25',         dot: 'bg-cyan-500' },
  Delivered:  { label: 'Delivered',  classes: 'bg-green-500/12 text-green-600 border-green-500/25',      dot: 'bg-green-500' },
  Cancelled:  { label: 'Cancelled',  classes: 'bg-red-500/12 text-red-600 border-red-500/25',            dot: 'bg-red-500' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG.Pending;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', config.classes)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };