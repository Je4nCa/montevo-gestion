import type { PaqueteClienteId, ServicioIncluido } from '@/shared/types/cliente';

export interface ClienteSnapshotAcuerdo {
  nombreCliente: string;
  ubicacion: string;
  representanteNombre: string;
  representanteCedula: string;
  diaPago: number;
}

export interface Acuerdo {
  id: string;
  clienteId: string;
  numero: string;
  anio: number;
  consecutivo: number;
  fecha: string;
  paqueteId: PaqueteClienteId;
  paqueteNombre: string;
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
