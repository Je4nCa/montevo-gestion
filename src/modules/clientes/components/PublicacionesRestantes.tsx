import { usePublicaciones, contarPublicacionesDelMes } from '@/modules/clientes/hooks/usePublicaciones';
import { resolverPaquete } from '@/shared/lib/paqueteCliente';
import type { Cliente } from '@/shared/types/cliente';

export function PublicacionesRestantes({ cliente }: { cliente: Cliente }) {
  const { data: publicaciones, loading } = usePublicaciones(cliente.id);
  const paquete = resolverPaquete(cliente);
  const usadas = contarPublicacionesDelMes(publicaciones);
  const incluidas = paquete.publicacionesIncluidas;
  const restantes = Math.max(incluidas - usadas, 0);

  if (loading) return <span className="text-muted-foreground">…</span>;

  return (
    <span className={restantes === 0 ? 'font-semibold text-destructive' : ''}>
      {incluidas >= 999 ? `${usadas} usadas (ilimitado)` : `${restantes} de ${incluidas}`}
    </span>
  );
}
