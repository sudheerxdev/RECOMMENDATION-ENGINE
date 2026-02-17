'use client';

import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';

interface ThemeSelectorProps {
  compact?: boolean;
  className?: string;
}

export const ThemeSelector = ({ compact = false, className }: ThemeSelectorProps) => {
  const { theme, setTheme, themes } = useTheme();

  if (compact) {
    return (
      <div className={cn('inline-flex items-center gap-1 rounded-lg border border-border bg-card/70 p-1', className)}>
        {themes.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium transition-colors',
              option.id === theme ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/55'
            )}
            aria-label={`Switch to ${option.label}`}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border/70 bg-card/60 p-2', className)}>
      <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <Palette className="h-3.5 w-3.5 text-primary" />
        Theme
      </p>
      <div className="mt-2 space-y-1.5">
        {themes.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={cn(
              'w-full rounded-lg border px-2.5 py-2 text-left text-xs transition-colors',
              option.id === theme
                ? 'border-primary/45 bg-primary/12 text-foreground'
                : 'border-border/70 bg-secondary/25 text-muted-foreground hover:bg-secondary/45'
            )}
          >
            <p className="font-medium">{option.label}</p>
            <p className="mt-0.5">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
