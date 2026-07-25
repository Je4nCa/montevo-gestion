import Dexie, { type EntityTable } from 'dexie';
import type { Cliente, Publicacion } from '@/shared/types/cliente';

class MontevoDB extends Dexie {
  clientes!: EntityTable<Cliente, 'id'>;
  publicaciones!: EntityTable<Publicacion, 'id'>;

  constructor() {
    super('montevo-gestion');
    this.version(1).stores({
      clientes: 'id, nombreCliente, paqueteId',
      publicaciones: 'id, clienteId, fecha',
    });
  }
}

export const db = new MontevoDB();
