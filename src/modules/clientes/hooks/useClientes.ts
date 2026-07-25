import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import type { Cliente, ClienteInput } from '@/shared/types/cliente';

interface UseClientesResult {
  data: Cliente[] | undefined;
  loading: boolean;
  error: Error | null;
  crear: (input: ClienteInput) => Promise<string>;
  actualizar: (id: string, input: ClienteInput) => Promise<void>;
  desactivar: (id: string) => Promise<void>;
}

export function useClientes(): UseClientesResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<Cliente[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setData([]);
      return;
    }
    setData(undefined);
    const clientesRef = collection(firestore, 'negocio', uid, 'clientes');
    const unsubscribe = onSnapshot(
      clientesRef,
      (snapshot) => {
        const clientes = snapshot.docs
          .map((d) => ({ ...(d.data() as Omit<Cliente, 'id'>), id: d.id }))
          .filter((c) => c.activo);
        setData(clientes);
        setError(null);
      },
      (err) => setError(err),
    );
    return unsubscribe;
  }, [uid]);

  async function crear(input: ClienteInput): Promise<string> {
    if (!uid) throw new Error('No hay sesión activa');
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(firestore, 'negocio', uid, 'clientes'), {
      ...input,
      activo: true,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  async function actualizar(id: string, input: ClienteInput): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await updateDoc(doc(firestore, 'negocio', uid, 'clientes', id), {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  }

  async function desactivar(id: string): Promise<void> {
    if (!uid) throw new Error('No hay sesión activa');
    await updateDoc(doc(firestore, 'negocio', uid, 'clientes', id), {
      activo: false,
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    data,
    loading: data === undefined,
    error,
    crear,
    actualizar,
    desactivar,
  };
}
