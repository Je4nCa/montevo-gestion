import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';

interface UseFirmaMontevoResult {
  data: string | undefined;
  loading: boolean;
  error: Error | null;
  guardar: (dataUrl: string) => Promise<void>;
}

export function useFirmaMontevo(): UseFirmaMontevoResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setData(undefined);
      return;
    }
    setData(undefined);
    const unsubscribe = onSnapshot(
      doc(firestore, 'negocio', uid, 'config', 'firmaMontevo'),
      (snapshot) => {
        const firmaDataUrl = snapshot.exists() ? (snapshot.data().firmaDataUrl as string) : null;
        setData(firmaDataUrl ?? '');
        setError(null);
      },
      (err) => setError(err),
    );
    return unsubscribe;
  }, [uid]);

  async function guardar(dataUrl: string): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await setDoc(doc(firestore, 'negocio', uid, 'config', 'firmaMontevo'), { firmaDataUrl: dataUrl });
  }

  return {
    data,
    loading: data === undefined,
    error,
    guardar,
  };
}
