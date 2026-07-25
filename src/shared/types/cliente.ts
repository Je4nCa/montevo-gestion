export type PaqueteId = 'esencial' | 'emprendedor' | 'profesional' | 'negocio' | 'corporativo';

export type PlataformaRedSocial =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'otro';

export type MetodoPago = 'sinpe' | 'transferencia' | 'efectivo' | 'tarjeta' | 'otro';

export type EstadoPago = 'al_dia' | 'pendiente';

export type TipoPublicacion = 'publicacion' | 'reel';

export interface Representante {
  nombre: string;
  cargo?: string;
  telefono?: string;
  email?: string;
}

export interface RedSocial {
  plataforma: PlataformaRedSocial;
  urlOHandle: string;
}

export interface Cliente {
  id: string;
  nombreCliente: string;
  telefono?: string;
  email?: string;
  representante: Representante;
  redesSociales: RedSocial[];
  paqueteId: PaqueteId;
  addOnsActivos: string[];
  calificaDescuentoAddOns: boolean;
  fechaInicioAcuerdo: string;
  diaPago: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  notas?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Publicacion {
  id: string;
  clienteId: string;
  fecha: string;
  tipo: TipoPublicacion;
  descripcion?: string;
  createdAt: string;
}

export type ClienteInput = Omit<Cliente, 'id' | 'activo' | 'createdAt' | 'updatedAt'>;
export type PublicacionInput = Omit<Publicacion, 'id' | 'createdAt'>;
