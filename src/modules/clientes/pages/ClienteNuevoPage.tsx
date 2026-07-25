import { useNavigate } from 'react-router-dom';
import { ClienteForm } from '@/modules/clientes/components/ClienteForm';
import { useClientes } from '@/modules/clientes/hooks/useClientes';
import type { ClienteInput } from '@/shared/types/cliente';

export function ClienteNuevoPage() {
  const { crear } = useClientes();
  const navigate = useNavigate();

  async function handleSubmit(values: ClienteInput) {
    const id = await crear(values);
    navigate(`/clientes/${id}`, { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-montevo-negro sm:text-3xl">
        Nuevo cliente
      </h1>
      <ClienteForm onSubmit={handleSubmit} onCancel={() => navigate('/')} submitLabel="Crear cliente" />
    </div>
  );
}
