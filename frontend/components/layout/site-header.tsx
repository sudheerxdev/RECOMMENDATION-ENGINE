'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BriefcaseBusiness, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { authStorage } from '@/lib/auth';
import { clearGoogleSessionHint } from '@/lib/google-auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' }
];

export const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(authStorage.getToken()));
  }, [pathname]);

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const logout = async () => {
    await clearGoogleSessionHint().catch(() => null);
    authStorage.clearAll();
    setHasToken(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          <span>AI Career Engine</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
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

          {!hasToken ? (
            <div className="ml-2 flex items-center gap-2">
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
            <Button variant="outline" size="sm" className="ml-2 gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
