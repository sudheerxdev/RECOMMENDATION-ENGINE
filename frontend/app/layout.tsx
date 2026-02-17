import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import { Suspense, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

const heading = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin']
});

const body = IBM_Plex_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'AI Career Recommendation Engine Platform',
  description:
    'Production-ready AI recommendation engine for career guidance, skill-gap analysis, and personalized learning roadmaps.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f4ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1729' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="warm-light" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} font-body antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-background pb-[5rem] text-foreground lg:pb-0">
            <SiteHeader />
            {children}
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>
            <Toaster richColors />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
