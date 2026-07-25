export interface AddOn {
  id: string;
  nombre: string;
}

export const ADD_ONS: AddOn[] = [
  { id: 'pagina-web-adicional', nombre: 'Página web adicional' },
  { id: 'sistema-facturacion', nombre: 'Sistema de facturación' },
  { id: 'sistema-inventarios', nombre: 'Sistema de inventarios' },
  { id: 'automatizaciones', nombre: 'Automatizaciones específicas' },
  { id: 'branding-avanzado', nombre: 'Branding avanzado' },
  { id: 'campanas-publicitarias', nombre: 'Campañas publicitarias' },
  { id: 'soporte-prioritario', nombre: 'Soporte prioritario' },
];

export function getAddOn(id: string): AddOn | undefined {
  return ADD_ONS.find((a) => a.id === id);
}
