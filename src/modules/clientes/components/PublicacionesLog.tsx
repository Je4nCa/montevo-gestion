import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { usePublicaciones, contarPublicacionesDelMes } from '@/modules/clientes/hooks/usePublicaciones';
import { getPaquete } from '@/shared/constants/paquetes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatFecha } from '@/shared/lib/utils';
import type { PaqueteId, TipoPublicacion } from '@/shared/types/cliente';

export function PublicacionesLog({ clienteId, paqueteId }: { clienteId: string; paqueteId: PaqueteId }) {
  const { data: publicaciones, loading, agregar } = usePublicaciones(clienteId);
  const paquete = getPaquete(paqueteId);
  const usadas = contarPublicacionesDelMes(publicaciones);
  const [open, setOpen] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState<TipoPublicacion>('publicacion');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await agregar({ clienteId, fecha, tipo, descripcion: descripcion || undefined });
      setDescripcion('');
      setOpen(false);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-base text-montevo-negro">
          <span className="font-semibold">
            {usadas} de {paquete.publicacionesIncluidas >= 999 ? '∞' : paquete.publicacionesIncluidas}
          </span>{' '}
          publicaciones usadas este mes
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Registrar publicación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar publicación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Fecha</Label>
                <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={(v) => setTipo(v as TipoPublicacion)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publicacion">Publicación</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Descripción (opcional)</Label>
                <Textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Registrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando historial…</p>
      ) : publicaciones && publicaciones.length > 0 ? (
        <ul className="flex flex-col divide-y divide-montevo-rosa/40 rounded-lg border border-montevo-rosa/60">
          {publicaciones.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-montevo-negro">
                  {p.tipo === 'reel' ? 'Reel' : 'Publicación'} — {formatFecha(p.fecha)}
                </p>
                {p.descripcion && <p className="text-sm text-muted-foreground">{p.descripcion}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Sin publicaciones registradas todavía.</p>
      )}
    </div>
  );
}
