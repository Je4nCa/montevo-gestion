import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import type { Cliente } from '@/shared/types/cliente';

interface UseClienteResult {
  data: Cliente | undefined;
  loading: boolean;
  error: Error | null;
}

export function useCliente(id: string | undefined): UseClienteResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<Cliente | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid || !id) {
      setData(undefined);
      setLoading(!!id);
      return;
    }
    setData(undefined);
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(firestore, 'negocio', uid, 'clientes', id),
      (snapshot) => {
        setData(snapshot.exists() ? ({ ...(snapshot.data() as Omit<Cliente, 'id'>), id: snapshot.id }) : undefined);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [uid, id]);

  return {
    data,
    loading,
    error,
  };
}
