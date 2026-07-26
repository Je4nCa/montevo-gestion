import { getPaquete } from '@/shared/constants/paquetes';
import type { PaqueteId, ServicioIncluido } from '@/shared/types/cliente';

function detallePublicaciones(paqueteId: PaqueteId): string {
  const paquete = getPaquete(paqueteId);
  if (paquete.publicacionesIncluidas >= 999) return 'Contenido ilimitado (dentro de lo razonable)';
  return `${paquete.publicacionesIncluidas} publicaciones profesionales mensuales`;
}

function detalleReels(paqueteId: PaqueteId): string {
  const paquete = getPaquete(paqueteId);
  if (paquete.reelsIncluidos >= 999) return 'Contenido ilimitado (dentro de lo razonable)';
  return `${paquete.reelsIncluidos} reels creativos mensuales`;
}

export function getServiciosIncluidos(paqueteId: PaqueteId): ServicioIncluido[] {
  switch (paqueteId) {
    case 'esencial':
      return [
        { servicio: 'Publicaciones', detalle: detallePublicaciones(paqueteId) },
        { servicio: 'Reels', detalle: detalleReels(paqueteId) },
        { servicio: 'Diseño gráfico', detalle: 'Piezas visuales de marca' },
        { servicio: 'Calendario de contenido', detalle: 'Organización mensual de publicaciones (básico)' },
      ];

    case 'emprendedor':
      return [
        { servicio: 'Gestión de redes sociales', detalle: 'Administración de cuentas del Cliente' },
        { servicio: 'Publicaciones', detalle: detallePublicaciones(paqueteId) },
        { servicio: 'Reels', detalle: detalleReels(paqueteId) },
        { servicio: 'Diseño gráfico', detalle: 'Piezas visuales de marca' },
        { servicio: 'Estrategia mensual', detalle: 'Plan de contenido y objetivos' },
        { servicio: 'Calendario de contenido', detalle: 'Organización mensual de publicaciones' },
        { servicio: 'Asesoría personalizada', detalle: 'Acompañamiento y recomendaciones' },
        { servicio: 'Reporte de resultados', detalle: 'Medición y análisis mensual de rendimiento' },
      ];

    case 'profesional':
      return [
        { servicio: 'Gestión de redes sociales', detalle: 'Administración de cuentas del Cliente' },
        { servicio: 'Publicaciones', detalle: detallePublicaciones(paqueteId) },
        { servicio: 'Reels', detalle: detalleReels(paqueteId) },
        { servicio: 'Diseño gráfico', detalle: 'Piezas visuales de marca' },
        { servicio: 'Estrategia mensual', detalle: 'Plan de contenido y objetivos' },
        { servicio: 'Calendario de contenido', detalle: 'Organización mensual de publicaciones' },
        { servicio: 'Asesoría personalizada', detalle: 'Acompañamiento y recomendaciones' },
        { servicio: 'Reporte de resultados', detalle: 'Medición y análisis mensual de rendimiento' },
        { servicio: 'Página web', detalle: 'Landing page (1 página)' },
        { servicio: 'Campaña de ads', detalle: '1 campaña de ads/mes gestionada (pauta aparte)' },
        { servicio: 'Branding básico', detalle: 'Logo y paleta, si el Cliente no los tiene' },
      ];

    case 'negocio':
      return [
        { servicio: 'Gestión de redes sociales', detalle: 'Administración de cuentas del Cliente' },
        { servicio: 'Publicaciones', detalle: detallePublicaciones(paqueteId) },
        { servicio: 'Reels', detalle: detalleReels(paqueteId) },
        { servicio: 'Diseño gráfico', detalle: 'Piezas visuales de marca' },
        { servicio: 'Estrategia mensual', detalle: 'Plan de contenido y objetivos' },
        { servicio: 'Calendario de contenido', detalle: 'Organización mensual de publicaciones' },
        { servicio: 'Asesoría personalizada', detalle: 'Acompañamiento y recomendaciones' },
        { servicio: 'Reporte de resultados', detalle: 'Medición y análisis mensual de rendimiento' },
        { servicio: 'Página web', detalle: 'Sitio multipágina' },
        { servicio: 'Sistema de ventas', detalle: 'POS/sistema de ventas (módulo base)' },
        { servicio: 'Sistema de inventario', detalle: 'Inventario básico' },
      ];

    case 'corporativo':
      return [
        { servicio: 'Gestión de redes sociales', detalle: 'Administración de cuentas del Cliente' },
        { servicio: 'Publicaciones', detalle: detallePublicaciones(paqueteId) },
        { servicio: 'Reels', detalle: detalleReels(paqueteId) },
        { servicio: 'Diseño gráfico', detalle: 'Piezas visuales de marca' },
        { servicio: 'Estrategia mensual', detalle: 'Plan de contenido, objetivos y reunión estratégica mensual' },
        { servicio: 'Calendario de contenido', detalle: 'Organización mensual de publicaciones' },
        { servicio: 'Asesoría personalizada', detalle: 'Acompañamiento y recomendaciones' },
        { servicio: 'Reporte de resultados', detalle: 'Analítica avanzada de rendimiento' },
        { servicio: 'Página web', detalle: 'Sitio multipágina' },
        { servicio: 'Sistema de ventas', detalle: 'POS multiusuario/multisucursal' },
        { servicio: 'Sistema de inventario', detalle: 'Inventario completo multiplataforma' },
        { servicio: 'Automatizaciones', detalle: 'Automatizaciones múltiples' },
        { servicio: 'Soporte prioritario', detalle: 'Atención prioritaria' },
      ];
  }
}
