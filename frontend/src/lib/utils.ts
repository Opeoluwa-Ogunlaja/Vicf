import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pipe =
  (...fns: ((...args: unknown[]) => unknown)[]) =>
  (x: unknown) =>
    fns.reduce((v, f) => f(v), x)
