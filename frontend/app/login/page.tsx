import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center px-4 py-16 sm:px-6">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="hidden rounded-lg border border-border bg-card/80 p-10 shadow-panel lg:block">
            <h1 className="font-heading text-4xl font-bold leading-tight">
              Career intelligence for fast, practical growth.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Upload your resume, map skill gaps, and get AI-ranked career recommendations with personalized learning
              plans.
            </p>
            <p className="mt-10 text-sm text-muted-foreground">
              New user?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
