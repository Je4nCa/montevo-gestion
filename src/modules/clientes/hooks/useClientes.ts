import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';
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
  const data = useLiveQuery(
    async () => (await db.clientes.toArray()).filter((c) => c.activo),
    [],
  );

  async function crear(input: ClienteInput): Promise<string> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const cliente: Cliente = { ...input, id, activo: true, createdAt: now, updatedAt: now };
    await db.clientes.add(cliente);
    return id;
  }

  async function actualizar(id: string, input: ClienteInput): Promise<void> {
    await db.clientes.update(id, { ...input, updatedAt: new Date().toISOString() });
  }

  async function desactivar(id: string): Promise<void> {
    await db.clientes.update(id, { activo: false, updatedAt: new Date().toISOString() });
  }

  return {
    data,
    loading: data === undefined,
    error: null,
    crear,
    actualizar,
    desactivar,
  };
}
