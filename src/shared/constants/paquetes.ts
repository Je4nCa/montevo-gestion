import type { PaqueteId } from '@/shared/types/cliente';

export interface Paquete {
  id: PaqueteId;
  nombre: string;
  precioMensual: number;
  publicacionesIncluidas: number;
  reelsIncluidos: number;
  descripcionCorta: string;
  nivel: number;
}

export const PAQUETES: Paquete[] = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    precioMensual: 25000,
    publicacionesIncluidas: 4,
    reelsIncluidos: 2,
    descripcionCorta: 'Presencia mínima y constante en redes sociales.',
    nivel: 0,
  },
  {
    id: 'emprendedor',
    nombre: 'Emprendedor',
    precioMensual: 50000,
    publicacionesIncluidas: 8,
    reelsIncluidos: 4,
    descripcionCorta: 'Gestión de redes, estrategia mensual y asesoría personalizada.',
    nivel: 1,
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precioMensual: 85000,
    publicacionesIncluidas: 12,
    reelsIncluidos: 6,
    descripcionCorta: 'Landing page, campaña de ads gestionada y branding básico.',
    nivel: 2,
  },
  {
    id: 'negocio',
    nombre: 'Negocio',
    precioMensual: 140000,
    publicacionesIncluidas: 16,
    reelsIncluidos: 8,
    descripcionCorta: 'Web multipágina, POS/ventas e inventario básico incluidos.',
    nivel: 3,
  },
  {
    id: 'corporativo',
    nombre: 'Corporativo',
    precioMensual: 230000,
    publicacionesIncluidas: 999,
    reelsIncluidos: 999,
    descripcionCorta: 'Inventario multiplataforma, POS multisucursal y soporte prioritario.',
    nivel: 4,
  },
];

export function getPaquete(id: PaqueteId): Paquete {
  const paquete = PAQUETES.find((p) => p.id === id);
  if (!paquete) {
    throw new Error(`Paquete desconocido: ${id}`);
  }
  return paquete;
}
