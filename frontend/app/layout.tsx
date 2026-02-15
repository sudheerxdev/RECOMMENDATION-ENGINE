import type { Metadata } from 'next';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SiteHeader } from '@/components/layout/site-header';
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

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} font-body antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <SiteHeader />
          {children}
          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}
