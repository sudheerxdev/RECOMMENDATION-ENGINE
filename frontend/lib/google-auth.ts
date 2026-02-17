'use client';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: 'popup' | 'redirect';
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'small' | 'medium' | 'large';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export const isGoogleSignInEnabled = Boolean(googleClientId);

const ensureGoogleScript = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is only available in the browser');
  }

  if (window.google?.accounts?.id) {
    return;
  }

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
  if (existingScript) {
    await new Promise((resolve) => {
      existingScript.addEventListener('load', resolve, { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
  });
};

export const requestGoogleIdToken = async () => {
  if (!googleClientId) {
    throw new Error('Google sign-in is not configured on the frontend');
  }

  await ensureGoogleScript();

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      reject(new Error('Google Identity API is unavailable'));
      return;
    }

    googleId.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (settled) {
          return;
        }
        if (!response?.credential) {
          settled = true;
          reject(new Error('Google sign-in did not return a token'));
          return;
        }
        settled = true;
        resolve(response.credential);
      }
    });

    googleId.prompt((notification) => {
      if (settled) {
        return;
      }
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        settled = true;
        reject(new Error('Google sign-in prompt was closed or blocked'));
      }
    });
  });
};

export const renderGoogleSignInButton = async ({
  container,
  text = 'continue_with',
  onCredential
}: {
  container: HTMLElement;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  onCredential: (idToken: string) => void;
}) => {
  if (!googleClientId) {
    throw new Error('Google sign-in is not configured on the frontend');
  }

  await ensureGoogleScript();
  const googleId = window.google?.accounts?.id;
  if (!googleId) {
    throw new Error('Google Identity API is unavailable');
  }

  googleId.initialize({
    client_id: googleClientId,
    ux_mode: 'popup',
    callback: (response) => {
      if (!response?.credential) {
        return;
      }
      onCredential(response.credential);
    }
  });

  container.innerHTML = '';
  googleId.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    shape: 'rectangular',
    logo_alignment: 'left',
    text,
    width: Math.max(container.clientWidth || 0, 260)
  });
};

export const clearGoogleSessionHint = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.google?.accounts?.id?.disableAutoSelect();
};
