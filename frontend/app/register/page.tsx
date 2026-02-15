import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="page-shell">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-xl">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
