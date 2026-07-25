import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { firestore } from '@/shared/lib/firebase';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { generarAcuerdoPdf } from '@/modules/clientes/acuerdos/lib/generarPdf';
import type { Acuerdo, AcuerdoInput } from '@/shared/types/acuerdo';

interface UseAcuerdosResult {
  data: Acuerdo[] | undefined;
  loading: boolean;
  error: Error | null;
  crear: (input: AcuerdoInput) => Promise<{ acuerdo: Acuerdo; blob: Blob }>;
}

async function obtenerSiguienteNumero(uid: string, anio: number): Promise<number> {
  const contadorRef = doc(firestore, 'negocio', uid, 'contadores', String(anio));
  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(contadorRef);
    const ultimo = snapshot.exists() ? (snapshot.data().ultimo as number) : 0;
    const siguiente = ultimo + 1;
    transaction.set(contadorRef, { ultimo: siguiente });
    return siguiente;
  });
}

export function useAcuerdos(clienteId: string): UseAcuerdosResult {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<Acuerdo[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setData([]);
      return;
    }
    setData(undefined);
    const acuerdosRef = query(
      collection(firestore, 'negocio', uid, 'acuerdos'),
      where('clienteId', '==', clienteId),
    );
    const unsubscribe = onSnapshot(
      acuerdosRef,
      (snapshot) => {
        const acuerdos = snapshot.docs
          .map((d) => ({ ...(d.data() as Omit<Acuerdo, 'id'>), id: d.id }))
          .sort((a, b) => b.consecutivo - a.consecutivo);
        setData(acuerdos);
        setError(null);
      },
      (err) => setError(err),
    );
    return unsubscribe;
  }, [uid, clienteId]);

  async function crear(input: AcuerdoInput): Promise<{ acuerdo: Acuerdo; blob: Blob }> {
    if (!uid) throw new Error('No hay sesión activa');

    const anio = new Date(input.fecha).getFullYear();
    const consecutivo = await obtenerSiguienteNumero(uid, anio);
    const numero = `MV-${anio}-${String(consecutivo).padStart(3, '0')}-A`;

    const { blob, base64 } = await generarAcuerdoPdf({ ...input, numero });

    const acuerdoData: Omit<Acuerdo, 'id'> = {
      ...input,
      numero,
      anio,
      consecutivo,
      pdfBase64: base64,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(firestore, 'negocio', uid, 'acuerdos'), acuerdoData);

    return { acuerdo: { ...acuerdoData, id: docRef.id }, blob };
  }

  return {
    data,
    loading: data === undefined,
    error,
    crear,
  };
}
