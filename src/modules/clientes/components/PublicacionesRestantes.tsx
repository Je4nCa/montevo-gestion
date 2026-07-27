import { usePublicaciones, contarPublicacionesDelMes } from '@/modules/clientes/hooks/usePublicaciones';
import { resolverPaquete } from '@/shared/lib/paqueteCliente';
import type { Cliente } from '@/shared/types/cliente';

export function PublicacionesRestantes({ cliente }: { cliente: Cliente }) {
  const { data: publicaciones, loading } = usePublicaciones(cliente.id);
  const paquete = resolverPaquete(cliente);

  if (loading) return <span className="text-muted-foreground">…</span>;

  const usadasPub = contarPublicacionesDelMes(publicaciones, 'publicacion');
  const usadasReels = contarPublicacionesDelMes(publicaciones, 'reel');
  const restantesPub = Math.max(paquete.publicacionesIncluidas - usadasPub, 0);
  const restantesReels = Math.max(paquete.reelsIncluidos - usadasReels, 0);

  return (
    <span className="flex flex-col text-sm leading-tight">
      <span className={restantesPub === 0 ? 'font-semibold text-destructive' : ''}>
        Pub:{' '}
        {paquete.publicacionesIncluidas >= 999
          ? `${usadasPub} (∞)`
          : `${restantesPub}/${paquete.publicacionesIncluidas}`}
      </span>
      <span className={restantesReels === 0 ? 'font-semibold text-destructive' : ''}>
        Reels:{' '}
        {paquete.reelsIncluidos >= 999
          ? `${usadasReels} (∞)`
          : `${restantesReels}/${paquete.reelsIncluidos}`}
      </span>
    </span>
  );
}
