import { usePublicaciones, contarPublicacionesDelMes } from '@/modules/clientes/hooks/usePublicaciones';
import { getPaquete } from '@/shared/constants/paquetes';
import type { PaqueteId } from '@/shared/types/cliente';

export function PublicacionesRestantes({
  clienteId,
  paqueteId,
}: {
  clienteId: string;
  paqueteId: PaqueteId;
}) {
  const { data: publicaciones, loading } = usePublicaciones(clienteId);
  const paquete = getPaquete(paqueteId);
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
