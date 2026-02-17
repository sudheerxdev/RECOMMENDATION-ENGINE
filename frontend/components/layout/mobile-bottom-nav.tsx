'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BookOpenCheck, House, LayoutDashboard, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { authStorage } from '@/lib/auth';
import { OPEN_PROFILE_PANEL_EVENT } from '@/lib/profile-panel';
import { cn } from '@/lib/utils';

type NavItem = {
  id: 'home' | 'dashboard' | 'resources' | 'profile';
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const baseItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: House },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'resources', label: 'Resources', href: '/career-resources', icon: BookOpenCheck },
  { id: 'profile', label: 'Profile', href: '/dashboard?profile=1', icon: UserRound }
];

const hiddenRoutes = new Set(['/login', '/register']);

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(authStorage.getToken()));
  }, [pathname]);

  const profileMode = searchParams.get('profile') === '1';

  const items = useMemo(
    () =>
      baseItems.map((item) => {
        if (!hasToken) {
          if (item.id === 'dashboard' || item.id === 'profile') {
            return { ...item, href: '/login' };
          }
          if (item.id === 'resources') {
            return { ...item, href: '/register' };
          }
        }
        return item;
      }),
    [hasToken]
  );

  if (hiddenRoutes.has(pathname)) {
    return null;
  }

  const isActive = (item: NavItem) => {
    if (item.id === 'home') {
      return pathname === '/';
    }

    if (item.id === 'dashboard') {
      return pathname === '/dashboard' && !profileMode;
    }

    if (item.id === 'resources') {
      return pathname === '/career-resources' || pathname === '/learning-recommendations';
    }

    if (item.id === 'profile') {
      return pathname === '/dashboard' && profileMode;
    }

    return false;
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.35rem)' }}
      aria-label="Mobile bottom navigation"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1 px-2 pt-2">
        {items.map((item) => {
          const active = isActive(item);

          if (item.id === 'profile') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!hasToken) {
                    router.push('/login');
                    return;
                  }

                  if (pathname === '/dashboard') {
                    window.dispatchEvent(new Event(OPEN_PROFILE_PANEL_EVENT));
                    return;
                  }

                  router.push('/dashboard?profile=1');
                }}
                className={cn(
                  'inline-flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors',
                  active
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors',
                active
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
