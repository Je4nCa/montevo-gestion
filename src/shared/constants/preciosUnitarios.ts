export interface ItemFacturable {
  id: string;
  nombre: string;
  precio: number;
  unidad: 'unico' | 'mensual';
}

export const PRECIOS_UNITARIOS: ItemFacturable[] = [
  { id: 'publicacion', nombre: 'Publicación extra', precio: 2000, unidad: 'unico' },
  { id: 'reel', nombre: 'Reel extra', precio: 6000, unidad: 'unico' },
  { id: 'pagina-web-adicional', nombre: 'Página web adicional', precio: 15000, unidad: 'mensual' },
  { id: 'sistema-facturacion', nombre: 'Sistema de facturación', precio: 30000, unidad: 'mensual' },
  { id: 'sistema-inventarios', nombre: 'Sistema de inventarios', precio: 15000, unidad: 'mensual' },
  {
    id: 'catalogo-productos-online',
    nombre: 'Catálogo de productos en línea',
    precio: 15000,
    unidad: 'mensual',
  },
  { id: 'automatizaciones', nombre: 'Automatizaciones específicas', precio: 50000, unidad: 'unico' },
  { id: 'branding-avanzado', nombre: 'Branding avanzado', precio: 150000, unidad: 'unico' },
  { id: 'campanas-publicitarias', nombre: 'Campañas publicitarias', precio: 40000, unidad: 'mensual' },
  { id: 'soporte-prioritario', nombre: 'Soporte prioritario', precio: 20000, unidad: 'mensual' },
];

export function getItemFacturable(id: string): ItemFacturable | undefined {
  return PRECIOS_UNITARIOS.find((i) => i.id === id);
}
