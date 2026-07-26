import { getPaquete } from '@/shared/constants/paquetes';
import { getServiciosIncluidos } from '@/shared/constants/serviciosPorPaquete';
import type { Cliente, ServicioIncluido } from '@/shared/types/cliente';

export interface PaqueteResuelto {
  nombre: string;
  precioMensual: number;
  precioEnPalabras: string;
  publicacionesIncluidas: number;
  reelsIncluidos: number;
}

export function resolverPaquete(cliente: Cliente): PaqueteResuelto {
  if (cliente.paqueteId === 'personalizado') {
    const p = cliente.paquetePersonalizado;
    return {
      nombre: p?.nombre ?? 'Personalizado',
      precioMensual: p?.precioMensual ?? 0,
      precioEnPalabras: p?.precioEnPalabras ?? '',
      publicacionesIncluidas: p?.publicacionesIncluidas ?? 0,
      reelsIncluidos: p?.reelsIncluidos ?? 0,
    };
  }
  return getPaquete(cliente.paqueteId);
}

export function resolverServiciosIncluidos(cliente: Cliente): ServicioIncluido[] {
  if (cliente.paqueteId === 'personalizado') {
    return cliente.paquetePersonalizado?.servicios ?? [];
  }
  return getServiciosIncluidos(cliente.paqueteId);
}
