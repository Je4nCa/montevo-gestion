import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { useCargosExtra, totalCargosDelMes } from '@/modules/clientes/hooks/useCargosExtra';
import { PRECIOS_UNITARIOS, getItemFacturable } from '@/shared/constants/preciosUnitarios';
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
import { formatColones, formatFecha } from '@/shared/lib/utils';

export function CargosExtraLog({ clienteId }: { clienteId: string }) {
  const { data: cargos, loading, agregar } = useCargosExtra(clienteId);
  const totalMes = totalCargosDelMes(cargos);

  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(PRECIOS_UNITARIOS[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [nota, setNota] = useState('');
  const [guardando, setGuardando] = useState(false);

  const item = getItemFacturable(itemId)!;
  const subtotal = item.precio * cantidad;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await agregar({
        clienteId,
        fecha,
        itemId: item.id,
        itemNombre: item.nombre,
        cantidad,
        precioUnitario: item.precio,
        total: subtotal,
        nota: nota || undefined,
      });
      setNota('');
      setCantidad(1);
      setOpen(false);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-base text-montevo-negro">
          <span className="font-semibold">{formatColones(totalMes)}</span> en cobros extra este mes
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Registrar cobro extra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar cobro extra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Ítem</Label>
                <Select value={itemId} onValueChange={setItemId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRECIOS_UNITARIOS.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.nombre} — {formatColones(i.precio)}
                        {i.unidad === 'mensual' ? '/mes' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fecha</Label>
                <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Nota (opcional)</Label>
                <Textarea rows={2} value={nota} onChange={(e) => setNota(e.target.value)} />
              </div>
              <p className="text-base text-montevo-negro">
                Subtotal: <span className="font-semibold">{formatColones(subtotal)}</span>
              </p>
              <Button type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Registrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando historial…</p>
      ) : cargos && cargos.length > 0 ? (
        <ul className="flex flex-col divide-y divide-montevo-rosa/40 rounded-lg border border-montevo-rosa/60">
          {cargos.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-montevo-negro">
                  {c.cantidad} × {c.itemNombre} — {formatFecha(c.fecha)}
                </p>
                {c.nota && <p className="text-sm text-muted-foreground">{c.nota}</p>}
              </div>
              <p className="font-semibold text-montevo-negro">{formatColones(c.total)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Sin cobros extra registrados todavía.</p>
      )}
    </div>
  );
}
