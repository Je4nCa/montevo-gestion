import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useCliente } from '@/modules/clientes/hooks/useCliente';
import { useClientes } from '@/modules/clientes/hooks/useClientes';
import { ClienteForm } from '@/modules/clientes/components/ClienteForm';
import { PublicacionesLog } from '@/modules/clientes/components/PublicacionesLog';
import { getPaquete } from '@/shared/constants/paquetes';
import { getAddOn } from '@/shared/constants/addOns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { formatColones, formatFecha } from '@/shared/lib/utils';
import type { ClienteInput } from '@/shared/types/cliente';

const METODO_PAGO_LABEL: Record<string, string> = {
  sinpe: 'SINPE Móvil',
  transferencia: 'Transferencia',
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
};

const PLATAFORMA_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  otro: 'Otro',
};

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, loading } = useCliente(id);
  const { actualizar, desactivar } = useClientes();
  const [editando, setEditando] = useState(false);

  if (loading) {
    return <p className="text-muted-foreground">Cargando cliente…</p>;
  }

  if (!cliente) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg text-montevo-negro">Cliente no encontrado.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  const paquete = getPaquete(cliente.paqueteId);

  async function handleUpdate(values: ClienteInput) {
    await actualizar(cliente!.id, values);
    setEditando(false);
  }

  async function handleDelete() {
    await desactivar(cliente!.id);
    navigate('/', { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link to="/" className="mb-2 inline-flex items-center gap-1 text-sm text-montevo-cafeOscuro hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Clientes
          </Link>
          <h1 className="font-display text-2xl font-semibold text-montevo-negro sm:text-3xl">
            {cliente.nombreCliente}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge>{paquete.nombre}</Badge>
            <Badge variant={cliente.estadoPago === 'al_dia' ? 'success' : 'destructive'}>
              {cliente.estadoPago === 'al_dia' ? 'Al día' : 'Pendiente'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditando(true)}>
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar a {cliente.nombreCliente}?</AlertDialogTitle>
                <AlertDialogDescription>
                  El cliente dejará de aparecer en el listado. Esta acción se puede revertir solo
                  desde la base de datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contacto y representante</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-base">
            <p><span className="text-muted-foreground">Teléfono:</span> {cliente.telefono || '—'}</p>
            <p><span className="text-muted-foreground">Email:</span> {cliente.email || '—'}</p>
            <div className="mt-2 border-t border-montevo-rosa/50 pt-2">
              <p className="font-medium text-montevo-negro">{cliente.representante.nombre}</p>
              {cliente.representante.cargo && (
                <p className="text-muted-foreground">{cliente.representante.cargo}</p>
              )}
              <p className="text-muted-foreground">
                {[cliente.representante.telefono, cliente.representante.email].filter(Boolean).join(' · ') || '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acuerdo y pago</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-base">
            <p><span className="text-muted-foreground">Paquete:</span> {paquete.nombre} — {formatColones(paquete.precioMensual)}/mes</p>
            <p><span className="text-muted-foreground">Inicio del acuerdo:</span> {formatFecha(cliente.fechaInicioAcuerdo)}</p>
            <p><span className="text-muted-foreground">Día de pago:</span> {cliente.diaPago}</p>
            <p><span className="text-muted-foreground">Método de pago:</span> {METODO_PAGO_LABEL[cliente.metodoPago]}</p>
            <p>
              <span className="text-muted-foreground">Descuento en add-ons:</span>{' '}
              {cliente.calificaDescuentoAddOns ? 'Sí califica' : 'No califica'}
            </p>
            {cliente.addOnsActivos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cliente.addOnsActivos.map((id) => (
                  <Badge key={id} variant="secondary">
                    {getAddOn(id)?.nombre ?? id}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent>
            {cliente.redesSociales.length === 0 ? (
              <p className="text-muted-foreground">Sin redes registradas.</p>
            ) : (
              <ul className="flex flex-col gap-1.5 text-base">
                {cliente.redesSociales.map((r, i) => (
                  <li key={i}>
                    <span className="text-muted-foreground">{PLATAFORMA_LABEL[r.plataforma]}:</span>{' '}
                    {r.urlOHandle}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas / acuerdos particulares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-base">{cliente.notas || 'Sin notas.'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <PublicacionesLog clienteId={cliente.id} paqueteId={cliente.paqueteId} />
        </CardContent>
      </Card>

      <Dialog open={editando} onOpenChange={setEditando}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm
            valoresIniciales={cliente}
            onSubmit={handleUpdate}
            onCancel={() => setEditando(false)}
            submitLabel="Guardar cambios"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
