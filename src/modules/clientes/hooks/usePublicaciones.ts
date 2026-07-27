import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import type { Publicacion, PublicacionInput, TipoPublicacion } from '@/shared/types/cliente';

interface UsePublicacionesResult {
  data: Publicacion[] | undefined;
  loading: boolean;
  error: Error | null;
  agregar: (input: PublicacionInput) => Promise<void>;
  actualizar: (id: string, input: PublicacionInput) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
}

export function usePublicaciones(clienteId: string): UsePublicacionesResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<Publicacion[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setData([]);
      return;
    }
    setData(undefined);
    const publicacionesRef = query(
      collection(firestore, 'negocio', uid, 'publicaciones'),
      where('clienteId', '==', clienteId),
    );
    const unsubscribe = onSnapshot(
      publicacionesRef,
      (snapshot) => {
        const publicaciones = snapshot.docs
          .map((d) => ({ ...(d.data() as Omit<Publicacion, 'id'>), id: d.id }))
          .sort((a, b) => b.fecha.localeCompare(a.fecha));
        setData(publicaciones);
        setError(null);
      },
      (err) => setError(err),
    );
    return unsubscribe;
  }, [uid, clienteId]);

  async function agregar(input: PublicacionInput): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await addDoc(collection(firestore, 'negocio', uid, 'publicaciones'), {
      ...input,
      createdAt: new Date().toISOString(),
    });
  }

  async function actualizar(id: string, input: PublicacionInput): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await updateDoc(doc(firestore, 'negocio', uid, 'publicaciones', id), { ...input });
  }

  async function eliminar(id: string): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await deleteDoc(doc(firestore, 'negocio', uid, 'publicaciones', id));
  }

  return {
    data,
    loading: data === undefined,
    error,
    agregar,
    actualizar,
    eliminar,
  };
}

function esDelMesActual(fechaIso: string): boolean {
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  return fechaIso.slice(0, 7) === mesActual;
}

export function contarPublicacionesDelMes(
  publicaciones: Publicacion[] | undefined,
  tipo?: TipoPublicacion,
): number {
  if (!publicaciones) return 0;
  return publicaciones.filter((p) => esDelMesActual(p.fecha) && (!tipo || p.tipo === tipo)).length;
}
