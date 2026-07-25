import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';
import type { Cliente } from '@/shared/types/cliente';

interface UseClienteResult {
  data: Cliente | undefined;
  loading: boolean;
  error: Error | null;
}

export function useCliente(id: string | undefined): UseClienteResult {
  const data = useLiveQuery(() => (id ? db.clientes.get(id) : undefined), [id]);

  return {
    data,
    loading: data === undefined,
    error: null,
  };
}
