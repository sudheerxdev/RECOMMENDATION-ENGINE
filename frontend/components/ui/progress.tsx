import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress = ({ value, className }: ProgressProps) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};
