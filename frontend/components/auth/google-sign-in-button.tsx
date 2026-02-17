'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authStorage } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import {
  isGoogleSignInEnabled,
  renderGoogleSignInButton,
  requestGoogleIdToken
} from '@/lib/google-auth';

interface GoogleSignInButtonProps {
  label?: string;
}

export const GoogleSignInButton = ({ label = 'Continue with Google' }: GoogleSignInButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const completeGoogleSignIn = useCallback(
    async (idToken: string) => {
      setIsLoading(true);
      try {
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
    },
    [router]
  );

  useEffect(() => {
    if (!isGoogleSignInEnabled || !buttonContainerRef.current) {
      return;
    }

    let mounted = true;
    const text = label.toLowerCase().includes('sign up') ? 'signup_with' : 'signin_with';

    const initialize = async () => {
      try {
        await renderGoogleSignInButton({
          container: buttonContainerRef.current as HTMLElement,
          text,
          onCredential: (idToken) => {
            if (!mounted) {
              return;
            }
            void completeGoogleSignIn(idToken);
          }
        });
        if (mounted) {
          setRenderError(null);
        }
      } catch (error: any) {
        if (!mounted) {
          return;
        }
        setRenderError(error?.message || 'Failed to initialize Google sign-in');
      }
    };

    initialize();
    const onResize = () => {
      void initialize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
    };
  }, [label, completeGoogleSignIn]);

  const handleGoogleSignInFallback = async () => {
    if (!isGoogleSignInEnabled) {
      toast.error('Google sign-in is not configured');
      return;
    }

    try {
      const idToken = await requestGoogleIdToken();
      await completeGoogleSignIn(idToken);
    } catch {
      toast.error('Google sign-in prompt was closed or blocked');
    }
  };

  if (!isGoogleSignInEnabled) {
    return (
      <Button variant="outline" className="w-full" onClick={handleGoogleSignInFallback} disabled>
        {label}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={buttonContainerRef} className="w-full" />
      {isLoading ? <p className="text-center text-xs text-muted-foreground">Connecting to Google...</p> : null}
      {renderError ? (
        <Button variant="outline" className="w-full" onClick={handleGoogleSignInFallback} disabled={isLoading}>
          {label}
        </Button>
      ) : null}
      {renderError ? <p className="text-center text-xs text-muted-foreground">{renderError}</p> : null}
    </div>
  );
};
