import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import type { CargoExtra, CargoExtraInput } from '@/shared/types/cliente';

interface UseCargosExtraResult {
  data: CargoExtra[] | undefined;
  loading: boolean;
  error: Error | null;
  agregar: (input: CargoExtraInput) => Promise<void>;
}

export function useCargosExtra(clienteId: string): UseCargosExtraResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<CargoExtra[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setData([]);
      return;
    }
    setData(undefined);
    const cargosRef = query(
      collection(firestore, 'negocio', uid, 'cargosExtra'),
      where('clienteId', '==', clienteId),
    );
    const unsubscribe = onSnapshot(
      cargosRef,
      (snapshot) => {
        const cargos = snapshot.docs
          .map((d) => ({ ...(d.data() as Omit<CargoExtra, 'id'>), id: d.id }))
          .sort((a, b) => b.fecha.localeCompare(a.fecha));
        setData(cargos);
        setError(null);
      },
      (err) => setError(err),
    );
    return unsubscribe;
  }, [uid, clienteId]);

  async function agregar(input: CargoExtraInput): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await addDoc(collection(firestore, 'negocio', uid, 'cargosExtra'), {
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

export function esDelMesActual(fechaIso: string): boolean {
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  return fechaIso.slice(0, 7) === mesActual;
}

export function totalCargosDelMes(cargos: CargoExtra[] | undefined): number {
  if (!cargos) return 0;
  return cargos.filter((c) => esDelMesActual(c.fecha)).reduce((sum, c) => sum + c.total, 0);
}
