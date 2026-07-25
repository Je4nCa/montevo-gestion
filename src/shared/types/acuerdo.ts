import type { PaqueteId } from '@/shared/types/cliente';

export interface ServicioIncluido {
  servicio: string;
  detalle: string;
}

export interface ClienteSnapshotAcuerdo {
  nombreCliente: string;
  ubicacion: string;
  representanteNombre: string;
  representanteCedula: string;
}

export interface Acuerdo {
  id: string;
  clienteId: string;
  numero: string;
  anio: number;
  consecutivo: number;
  fecha: string;
  paqueteId: PaqueteId;
  precioMensual: number;
  precioEnPalabras: string;
  serviciosIncluidos: ServicioIncluido[];
  clienteSnapshot: ClienteSnapshotAcuerdo;
  firmaClienteDataUrl: string;
  firmaMontevoDataUrl: string;
  pdfBase64: string;
  createdAt: string;
}

export type AcuerdoInput = Omit<Acuerdo, 'id' | 'numero' | 'anio' | 'consecutivo' | 'createdAt' | 'pdfBase64'>;

export type AcuerdoDocumentData = AcuerdoInput & { numero: string };
