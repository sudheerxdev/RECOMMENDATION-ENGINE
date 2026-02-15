'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardTopBarProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export const DashboardTopBar = ({ userName, userEmail, onLogout }: DashboardTopBarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 mb-6 rounded-2xl border border-border/80 bg-white/85 px-4 py-3 shadow-panel backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search skills, jobs, roadmap milestones..." />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-secondary/45"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <span className="hidden sm:block">{userName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-white p-2 shadow-panel">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/45"
                  onClick={onLogout}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
