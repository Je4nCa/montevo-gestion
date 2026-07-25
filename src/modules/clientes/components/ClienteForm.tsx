import type { ReactNode } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAQUETES } from '@/shared/constants/paquetes';
import { ADD_ONS } from '@/shared/constants/addOns';
import { cn } from '@/shared/lib/utils';
import type { ClienteInput } from '@/shared/types/cliente';

const representanteSchema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  cedula: z.string().min(1, 'Requerido'),
  cargo: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

const redSocialSchema = z.object({
  plataforma: z.enum(['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'otro']),
  urlOHandle: z.string().min(1, 'Requerido'),
});

const clienteSchema = z.object({
  nombreCliente: z.string().min(1, 'El nombre del cliente es requerido'),
  ubicacion: z.string().min(1, 'Requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  representante: representanteSchema,
  redesSociales: z.array(redSocialSchema),
  paqueteId: z.enum(['esencial', 'emprendedor', 'profesional', 'negocio', 'corporativo']),
  addOnsActivos: z.array(z.string()),
  calificaDescuentoAddOns: z.boolean(),
  fechaInicioAcuerdo: z.string().min(1, 'Requerido'),
  diaPago: z.coerce.number().int().min(1).max(31),
  metodoPago: z.enum(['sinpe', 'transferencia', 'efectivo', 'tarjeta', 'otro']),
  estadoPago: z.enum(['al_dia', 'pendiente']),
  notas: z.string().optional(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

const VALORES_POR_DEFECTO: ClienteFormValues = {
  nombreCliente: '',
  ubicacion: '',
  telefono: '',
  email: '',
  representante: { nombre: '', cedula: '', cargo: '', telefono: '', email: '' },
  redesSociales: [],
  paqueteId: 'esencial',
  addOnsActivos: [],
  calificaDescuentoAddOns: false,
  fechaInicioAcuerdo: new Date().toISOString().slice(0, 10),
  diaPago: 1,
  metodoPago: 'sinpe',
  estadoPago: 'al_dia',
  notas: '',
};

interface ClienteFormProps {
  valoresIniciales?: Partial<ClienteFormValues>;
  onSubmit: (values: ClienteInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ClienteForm({
  valoresIniciales,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar cliente',
}: ClienteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { ...VALORES_POR_DEFECTO, ...valoresIniciales },
  });

  const redesFieldArray = useFieldArray({ control, name: 'redesSociales' });

  async function submit(values: ClienteFormValues) {
    await onSubmit({
      ...values,
      telefono: values.telefono || undefined,
      email: values.email || undefined,
      notas: values.notas || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Datos del cliente</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Campo label="Nombre del cliente / negocio" error={errors.nombreCliente?.message}>
            <Input {...register('nombreCliente')} />
          </Campo>
          <Campo label="Ubicación" error={errors.ubicacion?.message}>
            <Input placeholder="Ej. Grecia, Alajuela, Costa Rica" {...register('ubicacion')} />
          </Campo>
          <Campo label="Teléfono">
            <Input {...register('telefono')} />
          </Campo>
          <Campo label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </Campo>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Representante</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Campo label="Nombre" error={errors.representante?.nombre?.message}>
            <Input {...register('representante.nombre')} />
          </Campo>
          <Campo label="Cédula" error={errors.representante?.cedula?.message}>
            <Input placeholder="1-1919-0376" {...register('representante.cedula')} />
          </Campo>
          <Campo label="Cargo">
            <Input {...register('representante.cargo')} />
          </Campo>
          <Campo label="Teléfono">
            <Input {...register('representante.telefono')} />
          </Campo>
          <Campo label="Email" error={errors.representante?.email?.message}>
            <Input type="email" {...register('representante.email')} />
          </Campo>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Acuerdo</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Campo label="Paquete">
            <Controller
              control={control}
              name="paqueteId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAQUETES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Campo>
          <Campo label="Fecha de inicio del acuerdo" error={errors.fechaInicioAcuerdo?.message}>
            <Input type="date" {...register('fechaInicioAcuerdo')} />
          </Campo>
        </div>

        <div>
          <Label className="mb-2 block">Add-ons activos</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ADD_ONS.map((addOn) => (
              <label key={addOn.id} className="flex items-center gap-2 text-base text-montevo-negro">
                <input type="checkbox" value={addOn.id} {...register('addOnsActivos')} className="h-4 w-4 accent-montevo-cafe" />
                {addOn.nombre}
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-base text-montevo-negro">
          <input type="checkbox" {...register('calificaDescuentoAddOns')} className="h-4 w-4 accent-montevo-cafe" />
          Califica para descuento en add-ons
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Pago</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Campo label="Día de pago" error={errors.diaPago?.message}>
            <Input type="number" min={1} max={31} {...register('diaPago')} />
          </Campo>
          <Campo label="Método de pago">
            <Controller
              control={control}
              name="metodoPago"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sinpe">SINPE Móvil</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Campo>
          <Campo label="Estado de pago">
            <Controller
              control={control}
              name="estadoPago"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="al_dia">Al día</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Campo>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Redes sociales</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => redesFieldArray.append({ plataforma: 'instagram', urlOHandle: '' })}
          >
            <Plus className="h-4 w-4" />
            Agregar red
          </Button>
        </div>
        {redesFieldArray.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin redes sociales agregadas.</p>
        )}
        <div className="flex flex-col gap-3">
          {redesFieldArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Controller
                control={control}
                name={`redesSociales.${index}.plataforma`}
                render={({ field: selectField }) => (
                  <Select value={selectField.value} onValueChange={selectField.onChange}>
                    <SelectTrigger className="sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                placeholder="@usuario o URL"
                className="flex-1"
                {...register(`redesSociales.${index}.urlOHandle`)}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => redesFieldArray.remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-montevo-cafeOscuro">Notas / acuerdos particulares</h2>
        <Textarea rows={4} {...register('notas')} />
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Campo({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
      {error && <p className={cn('text-sm text-destructive')}>{error}</p>}
    </div>
  );
}
