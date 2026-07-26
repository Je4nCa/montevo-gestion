import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useClientes } from '@/modules/clientes/hooks/useClientes';
import { PublicacionesRestantes } from '@/modules/clientes/components/PublicacionesRestantes';
import { PAQUETES } from '@/shared/constants/paquetes';
import { resolverPaquete } from '@/shared/lib/paqueteCliente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { MONTEVITO_URL } from '@/shared/lib/assets';
import { getPaquete } from '@/shared/constants/paquetes';
import type { PaqueteClienteId } from '@/shared/types/cliente';

const BADGE_POR_NIVEL: Record<number, 'secondary' | 'outline' | 'default' | 'warning' | 'success'> = {
  0: 'outline',
  1: 'secondary',
  2: 'default',
  3: 'warning',
  4: 'success',
};

export function ClientesListPage() {
  const { data: clientes, loading } = useClientes();
  const [busqueda, setBusqueda] = useState('');
  const [filtroPaquete, setFiltroPaquete] = useState<PaqueteClienteId | 'todos'>('todos');

  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    return clientes
      .filter((c) => filtroPaquete === 'todos' || c.paqueteId === filtroPaquete)
      .filter((c) => c.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => a.nombreCliente.localeCompare(b.nombreCliente));
  }, [clientes, busqueda, filtroPaquete]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-montevo-negro sm:text-3xl">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            {clientes ? `${clientes.length} cliente${clientes.length === 1 ? '' : 's'} activo${clientes.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/clientes/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente…"
            className="pl-9"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select
          value={filtroPaquete}
          onValueChange={(v) => setFiltroPaquete(v as PaqueteClienteId | 'todos')}
        >
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Filtrar por paquete" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los paquetes</SelectItem>
            {PAQUETES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre}
              </SelectItem>
            ))}
            <SelectItem value="personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando clientes…</p>
      ) : clientesFiltrados.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-montevo-rosa py-16 text-center">
          <img src={MONTEVITO_URL} alt="" className="h-20 w-20 object-contain opacity-80" />
          <p className="text-lg font-medium text-montevo-negro">
            {clientes && clientes.length > 0 ? 'No hay clientes que coincidan' : 'Aún no tienes clientes registrados'}
          </p>
          {(!clientes || clientes.length === 0) && (
            <Button asChild>
              <Link to="/clientes/nuevo">
                <Plus className="h-4 w-4" />
                Registrar el primero
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Paquete</TableHead>
              <TableHead>Publicaciones</TableHead>
              <TableHead>Día de pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.map((cliente) => {
              const paquete = resolverPaquete(cliente);
              const badgeVariant =
                cliente.paqueteId === 'personalizado'
                  ? 'outline'
                  : BADGE_POR_NIVEL[getPaquete(cliente.paqueteId).nivel];
              return (
                <TableRow key={cliente.id} className="cursor-pointer">
                  <TableCell>
                    <Link to={`/clientes/${cliente.id}`} className="font-medium text-montevo-negro hover:underline">
                      {cliente.nombreCliente}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant}>{paquete.nombre}</Badge>
                  </TableCell>
                  <TableCell>
                    <PublicacionesRestantes cliente={cliente} />
                  </TableCell>
                  <TableCell>Día {cliente.diaPago}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.estadoPago === 'al_dia' ? 'success' : 'destructive'}>
                      {cliente.estadoPago === 'al_dia' ? 'Al día' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
