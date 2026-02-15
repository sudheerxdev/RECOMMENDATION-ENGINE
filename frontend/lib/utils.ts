import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const parseTags = (value: string): string[] =>
  value
    .split(/[,\n;|]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const formatScoreTone = (score: number): 'success' | 'warning' | 'danger' => {
  if (score >= 75) {
    return 'success';
  }
  if (score >= 50) {
    return 'warning';
  }
  return 'danger';
};
