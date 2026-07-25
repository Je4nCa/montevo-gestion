import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import type { Publicacion, PublicacionInput } from '@/shared/types/cliente';

interface UsePublicacionesResult {
  data: Publicacion[] | undefined;
  loading: boolean;
  error: Error | null;
  agregar: (input: PublicacionInput) => Promise<void>;
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

  return {
    data,
    loading: data === undefined,
    error,
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
