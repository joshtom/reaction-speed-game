import type { CSSProperties } from 'react';

export type CustomStyle = CSSProperties & Record<`--${string}`, string | number>;

export function keyboardLabel(key: string): string {
  if (key === 'arrowup') return 'Arrow ↑';
  if (key === 'arrowdown') return 'Arrow ↓';
  if (key === 'arrowleft') return 'Arrow ←';
  if (key === 'arrowright') return 'Arrow →';
  return key.toUpperCase();
}
