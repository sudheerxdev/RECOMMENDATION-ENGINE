'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BriefcaseBusiness, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/theme/theme-selector';
import { OpenCreditsButton } from '@/components/home/open-credits-button';
import { authStorage } from '@/lib/auth';
import { clearGoogleSessionHint } from '@/lib/google-auth';
import { cn } from '@/lib/utils';

export const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    ...(hasToken ? [{ href: '/career-resources', label: 'Career Resources' }] : [])
  ];

  useEffect(() => {
    setHasToken(Boolean(authStorage.getToken()));
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const logout = async () => {
    await clearGoogleSessionHint().catch(() => null);
    authStorage.clearAll();
    setHasToken(false);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="site-header sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>
          <span>
            AI Career & Job Engine
            <span className="ml-2 hidden rounded-full border border-border/70 bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline-block">
              Beta
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 sm:gap-3 lg:flex">
          <ThemeSelector compact className="hidden xl:inline-flex" />

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/45',
                pathname === item.href ? 'bg-secondary/60 text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}

          <OpenCreditsButton buttonProps={{ variant: 'outline', size: 'sm' }} />

          {!hasToken ? (
            <div className="ml-1 flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="ml-1 gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSelector compact className="hidden sm:inline-flex" />
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-controls="site-mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div
        id="site-mobile-menu"
        className={cn(
          'overflow-hidden border-t border-border/70 transition-[max-height,opacity] duration-300 lg:hidden',
          mobileMenuOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-3 sm:px-6">
          <ThemeSelector compact className="mb-3 w-full justify-between" />

          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-mobile`}
                href={item.href}
                className={cn(
                  'rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/45',
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 grid gap-2">
            <OpenCreditsButton buttonProps={{ variant: 'outline', className: 'w-full justify-center' }} />

            {!hasToken ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full justify-center">Get Started</Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" className="w-full justify-center gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
