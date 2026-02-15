'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authStorage } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { isGoogleSignInEnabled, requestGoogleIdToken } from '@/lib/google-auth';

interface GoogleSignInButtonProps {
  label?: string;
}

export const GoogleSignInButton = ({ label = 'Continue with Google' }: GoogleSignInButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isGoogleSignInEnabled) {
      toast.error('Google sign-in is not configured');
      return;
    }

    setIsLoading(true);
    try {
      const idToken = await requestGoogleIdToken();
      const response = await apiClient.googleSignIn({ idToken });
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
      toast.success('Signed in with Google');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Google sign-in failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? 'Connecting...' : label}
    </Button>
  );
};
