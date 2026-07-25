import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatColones(monto: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(iso),
  );
}
