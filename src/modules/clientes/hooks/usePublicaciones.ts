import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';
import type { Publicacion, PublicacionInput } from '@/shared/types/cliente';

interface UsePublicacionesResult {
  data: Publicacion[] | undefined;
  loading: boolean;
  error: Error | null;
  agregar: (input: PublicacionInput) => Promise<void>;
}

export function usePublicaciones(clienteId: string): UsePublicacionesResult {
  const data = useLiveQuery(
    () =>
      db.publicaciones
        .where('clienteId')
        .equals(clienteId)
        .reverse()
        .sortBy('fecha'),
    [clienteId],
  );

  async function agregar(input: PublicacionInput): Promise<void> {
    const publicacion: Publicacion = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.publicaciones.add(publicacion);
  }

  return {
    data,
    loading: data === undefined,
    error: null,
    agregar,
  };
}

export function contarPublicacionesDelMes(publicaciones: Publicacion[] | undefined): number {
  if (!publicaciones) return 0;
  const ahora = new Date();
  return publicaciones.filter((p) => {
    const fecha = new Date(p.fecha);
    return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
  }).length;
}
