'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OPEN_CREDITS_POPUP_EVENT } from '@/lib/credits-popup';

export const CreditsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const maybeOpenFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('credits') !== '1') {
        return;
      }

      setIsOpen(true);
      params.delete('credits');
      const nextSearch = params.toString();
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', nextUrl);
    };

    const openFromEvent = () => {
      setIsOpen(true);
    };

    maybeOpenFromQuery();
    window.addEventListener(OPEN_CREDITS_POPUP_EVENT, openFromEvent);

    return () => {
      window.removeEventListener(OPEN_CREDITS_POPUP_EVENT, openFromEvent);
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_35%),radial-gradient(circle_at_82%_78%,rgba(251,146,60,0.16),transparent_35%)]" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-card/95 shadow-[0_32px_80px_-28px_rgba(8,18,42,0.8)]">
        <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-6 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-3 top-3 z-10 rounded-md border border-border/70 bg-white/70 p-1.5 text-muted-foreground hover:bg-secondary/55 hover:text-foreground"
          aria-label="Close credits popup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[280px] flex-col justify-between border-b border-border/60 bg-gradient-to-br from-sky-600/25 via-primary/20 to-accent/25 p-6 md:border-b-0 md:border-r">
            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-border/70 bg-white/80 px-2.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Special Credits
            </div>

            <div className="rounded-2xl border border-border/70 bg-white/80 p-4 shadow-panel backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-gradient-to-br from-primary/20 to-accent/20 font-heading text-2xl font-bold text-primary">
                  YK
                </div>
                <div>
                  <p className="font-heading text-lg font-bold">Yusuf Khan Sir</p>
                  <p className="text-sm font-semibold text-primary">Best Educator</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Retired from corporate and now a full-time teacher with 10+ years of experience.
              </p>
            </div>
          </div>

          <div className="relative space-y-4 p-6">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-warning" />
              Appreciation
            </p>
            <h3 className="font-heading text-3xl font-bold tracking-tight">Before You Go!</h3>
            <p className="text-sm text-muted-foreground">
              Special thanks to <span className="font-semibold text-foreground">Yusuf Khan Sir</span> (
              <span className="font-semibold text-primary">Best Educator</span>).
            </p>
            <p className="text-sm text-muted-foreground">
              About: Retired from corporate and now a full-time teacher with 10+ years of experience . Taught 10K+ students, inspiring many to pursue careers in tech. A true mentor and guide for aspiring developers.
            </p>

            <div className="rounded-xl border border-success/35 bg-success/10 p-3 text-sm">
              <p className="inline-flex items-center gap-1 font-semibold text-success">
                <Star className="h-4 w-4" />
                Respect and Credits
              </p>
              <p className="mt-1 text-muted-foreground">
                Thank you for inspiring learners and guiding careers with practical knowledge.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="min-w-[110px]" onClick={closePopup}>
                Got it
              </Button>
              <Button variant="outline" onClick={closePopup}>
                Remind later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
