import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { usePublicaciones, contarPublicacionesDelMes } from '@/modules/clientes/hooks/usePublicaciones';
import { resolverPaquete } from '@/shared/lib/paqueteCliente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatFecha } from '@/shared/lib/utils';
import type { Cliente, Publicacion, TipoPublicacion } from '@/shared/types/cliente';

interface PublicacionesLogProps {
  cliente: Cliente;
  tipo: TipoPublicacion;
}

interface FormState {
  fecha: string;
  descripcion: string;
}

const HOY = () => new Date().toISOString().slice(0, 10);

export function PublicacionesLog({ cliente, tipo }: PublicacionesLogProps) {
  const clienteId = cliente.id;
  const { data: todas, loading, agregar, actualizar, eliminar } = usePublicaciones(clienteId);
  const paquete = resolverPaquete(cliente);
  const incluidas = tipo === 'reel' ? paquete.reelsIncluidos : paquete.publicacionesIncluidas;
  const publicaciones = todas?.filter((p) => p.tipo === tipo);
  const usadas = contarPublicacionesDelMes(todas, tipo);

  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<FormState>({ fecha: HOY(), descripcion: '' });
  const [editando, setEditando] = useState<Publicacion | null>(null);
  const [guardando, setGuardando] = useState(false);

  const titulo = tipo === 'reel' ? 'Reels' : 'Publicaciones';
  const singular = tipo === 'reel' ? 'reel' : 'publicación';

  async function handleCrear(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await agregar({
        clienteId,
        fecha: nuevo.fecha,
        tipo,
        descripcion: nuevo.descripcion || undefined,
      });
      setNuevo({ fecha: HOY(), descripcion: '' });
      setOpen(false);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEditar(e: FormEvent) {
    e.preventDefault();
    if (!editando) return;
    setGuardando(true);
    try {
      await actualizar(editando.id, {
        clienteId,
        fecha: editando.fecha,
        tipo: editando.tipo,
        descripcion: editando.descripcion || undefined,
      });
      setEditando(null);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-base text-montevo-negro">
            <span className="font-semibold">
              {usadas} de {incluidas >= 999 ? '∞' : incluidas}
            </span>{' '}
            {titulo.toLowerCase()} usados este mes
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Registrar {singular}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar {singular}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCrear} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={nuevo.fecha}
                    onChange={(e) => setNuevo((n) => ({ ...n, fecha: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Descripción (opcional)</Label>
                  <Textarea
                    rows={2}
                    value={nuevo.descripcion}
                    onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value }))}
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
                <div className="min-w-0">
                  <p className="font-medium text-montevo-negro">{formatFecha(p.fecha)}</p>
                  {p.descripcion && (
                    <p className="truncate text-sm text-muted-foreground">{p.descripcion}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditando(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este registro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Se eliminará el registro de {singular} del {formatFecha(p.fecha)}. Esta
                          acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => eliminar(p.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Sin {titulo.toLowerCase()} registrados todavía.</p>
        )}
      </CardContent>

      <Dialog open={editando !== null} onOpenChange={(v) => !v && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {singular}</DialogTitle>
          </DialogHeader>
          {editando && (
            <form onSubmit={handleEditar} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={editando.fecha}
                  onChange={(e) => setEditando({ ...editando, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Descripción (opcional)</Label>
                <Textarea
                  rows={2}
                  value={editando.descripcion ?? ''}
                  onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
