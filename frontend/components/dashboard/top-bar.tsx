'use client';

import Link from 'next/link';
import { Bell, Search, UserRound } from 'lucide-react';
import { ThemeSelector } from '@/components/theme/theme-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardTopBarProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string | null;
  onOpenProfile: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const pageLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/career-resources', label: 'Career Resources' }
];

const sectionLinks = [
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'goals', label: 'Goals' },
  { id: 'badges', label: 'Badges' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'learning', label: 'Resources' }
];

export const DashboardTopBar = ({
  userName,
  userEmail,
  userAvatarUrl,
  onOpenProfile,
  onLogout,
  searchQuery,
  onSearchChange
}: DashboardTopBarProps) => {
  return (
    <div className="sticky top-0 z-30 mb-6 rounded-2xl border border-border/80 bg-white/85 px-4 py-3 shadow-panel backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search roles, skills, resources, projects..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSelector compact className="hidden md:inline-flex" />

          <Button variant="outline" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </Button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-secondary/45"
            title={`${userName} - ${userEmail}`}
          >
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={userName}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
            <span className="hidden sm:block">{userName}</span>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </button>

          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/65 pt-3">
        {pageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border/70 bg-white/75 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/55 hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-border md:inline-block" />
        {sectionLinks.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-border/70 bg-secondary/25 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/55 hover:text-foreground"
          >
            {section.label}
          </a>
        ))}
      </div>
    </div>
  );
};
