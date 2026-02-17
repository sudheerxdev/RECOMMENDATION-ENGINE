'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';
import { OPEN_CREDITS_POPUP_EVENT } from '@/lib/credits-popup';

interface OpenCreditsButtonProps {
  label?: string;
  buttonProps?: Omit<ButtonProps, 'onClick'>;
}

export const OpenCreditsButton = ({ label = 'Credits', buttonProps }: OpenCreditsButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname === '/') {
      window.dispatchEvent(new Event(OPEN_CREDITS_POPUP_EVENT));
      return;
    }

    router.push('/?credits=1');
  };

  return (
    <Button {...buttonProps} onClick={handleClick}>
      {label}
    </Button>
  );
};
