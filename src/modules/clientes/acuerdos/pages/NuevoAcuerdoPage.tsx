import { useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileCheck2, X } from 'lucide-react';
import { useCliente } from '@/modules/clientes/hooks/useCliente';
import { useFirmaMontevo } from '@/modules/clientes/acuerdos/hooks/useFirmaMontevo';
import { useAcuerdos } from '@/modules/clientes/acuerdos/hooks/useAcuerdos';
import { FirmaCanvas, type FirmaCanvasHandle } from '@/modules/clientes/acuerdos/components/FirmaCanvas';
import { descargarPdf } from '@/modules/clientes/acuerdos/lib/generarPdf';
import { getPaquete } from '@/shared/constants/paquetes';
import { getServiciosIncluidos } from '@/shared/constants/serviciosPorPaquete';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatColones } from '@/shared/lib/utils';
import type { Acuerdo } from '@/shared/types/acuerdo';

type Paso = 'revision' | 'firma_montevo' | 'firma_cliente' | 'generando' | 'listo';

export function NuevoAcuerdoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, loading: cargandoCliente } = useCliente(id);
  const firmaMontevo = useFirmaMontevo();
  const { crear } = useAcuerdos(id ?? '');

  const [paso, setPaso] = useState<Paso>('revision');
  const [montevoFirmandoDeNuevo, setMontevoFirmandoDeNuevo] = useState(false);
  const [firmaMontevoNueva, setFirmaMontevoNueva] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ acuerdo: Acuerdo; blob: Blob } | null>(null);

  const canvasMontevoRef = useRef<FirmaCanvasHandle>(null);
  const canvasClienteRef = useRef<FirmaCanvasHandle>(null);

  if (cargandoCliente || firmaMontevo.loading) {
    return <p className="text-muted-foreground">Cargando…</p>;
  }

  if (!cliente || !id) {
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
  const servicios = getServiciosIncluidos(cliente.paqueteId);
  const firmaMontevoActual = firmaMontevoNueva ?? firmaMontevo.data ?? '';

  async function confirmarFirmaMontevo() {
    if (montevoFirmandoDeNuevo || !firmaMontevoActual) {
      const dataUrl = canvasMontevoRef.current?.obtenerFirma();
      if (!dataUrl) {
        setError('Falta dibujar la firma antes de continuar.');
        return;
      }
      await firmaMontevo.guardar(dataUrl);
      setFirmaMontevoNueva(dataUrl);
    }
    setError(null);
    setMontevoFirmandoDeNuevo(false);
    setPaso('firma_cliente');
  }

  function confirmarFirmaCliente() {
    const dataUrl = canvasClienteRef.current?.obtenerFirma();
    if (!dataUrl) {
      setError('Falta la firma del cliente.');
      return;
    }
    setError(null);
    generarAcuerdo(dataUrl);
  }

  async function generarAcuerdo(dataUrlFirmaCliente: string) {
    setPaso('generando');
    try {
      const resultadoCreacion = await crear({
        clienteId: id!,
        fecha: new Date().toISOString(),
        paqueteId: cliente!.paqueteId,
        precioMensual: paquete.precioMensual,
        precioEnPalabras: paquete.precioEnPalabras,
        serviciosIncluidos: servicios,
        clienteSnapshot: {
          nombreCliente: cliente!.nombreCliente,
          ubicacion: cliente!.ubicacion,
          representanteNombre: cliente!.representante.nombre,
          representanteCedula: cliente!.representante.cedula,
        },
        firmaClienteDataUrl: dataUrlFirmaCliente,
        firmaMontevoDataUrl: firmaMontevoActual,
      });
      setResultado(resultadoCreacion);
      descargarPdf(
        resultadoCreacion.blob,
        `Acuerdo_${cliente!.nombreCliente.replace(/\s+/g, '_')}_${resultadoCreacion.acuerdo.numero}.pdf`,
      );
      setPaso('listo');
    } catch {
      setError('No se pudo generar el acuerdo. Intenta de nuevo.');
      setPaso('firma_cliente');
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link
        to={`/clientes/${id}`}
        className="inline-flex items-center gap-1 text-sm text-montevo-cafeOscuro hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {cliente.nombreCliente}
      </Link>

      <h1 className="font-display text-2xl font-semibold text-montevo-negro sm:text-3xl">
        Nuevo acuerdo
      </h1>

      {paso === 'revision' && (
        <Card>
          <CardHeader>
            <CardTitle>Revisa los datos del contrato</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-base">
            <div>
              <p className="font-medium text-montevo-negro">{cliente.nombreCliente}</p>
              <p className="text-muted-foreground">{cliente.ubicacion}</p>
              <p className="text-muted-foreground">
                {cliente.representante.nombre} · cédula {cliente.representante.cedula}
              </p>
            </div>
            <div>
              <p>
                <span className="text-muted-foreground">Paquete:</span> {paquete.nombre} —{' '}
                {formatColones(paquete.precioMensual)}/mes
              </p>
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Servicios incluidos:</p>
              <ul className="flex flex-col gap-1">
                {servicios.map((s) => (
                  <li key={s.servicio}>
                    <span className="font-medium">{s.servicio}:</span> {s.detalle}
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => setPaso('firma_montevo')} className="mt-2 w-full" size="lg">
              Continuar a firma
            </Button>
          </CardContent>
        </Card>
      )}

      {paso === 'firma_montevo' && firmaMontevoActual && !montevoFirmandoDeNuevo && (
        <Card>
          <CardHeader>
            <CardTitle>Firma de Montevo Studio</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <img
              src={firmaMontevoActual}
              alt="Firma de Montevo Studio"
              className="h-32 w-full rounded-md border border-input bg-white object-contain"
            />
            <Button variant="outline" size="sm" onClick={() => setMontevoFirmandoDeNuevo(true)}>
              Firmar de nuevo
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={confirmarFirmaMontevo} size="lg">
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {paso === 'firma_montevo' && (!firmaMontevoActual || montevoFirmandoDeNuevo) && (
        <PantallaFirma
          titulo="Firma de Montevo Studio"
          canvasRef={canvasMontevoRef}
          error={error}
          onConfirmar={confirmarFirmaMontevo}
          onCancelar={() =>
            montevoFirmandoDeNuevo ? setMontevoFirmandoDeNuevo(false) : setPaso('revision')
          }
          confirmarLabel="Continuar"
        />
      )}

      {paso === 'firma_cliente' && (
        <PantallaFirma
          titulo="Firma del cliente"
          subtitulo={`Pásale el celular a ${cliente.representante.nombre} para que firme`}
          canvasRef={canvasClienteRef}
          error={error}
          onConfirmar={confirmarFirmaCliente}
          onCancelar={() => setPaso('firma_montevo')}
          confirmarLabel="Confirmar firma"
        />
      )}

      {paso === 'generando' && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Generando el acuerdo…
          </CardContent>
        </Card>
      )}

      {paso === 'listo' && resultado && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <FileCheck2 className="h-12 w-12 text-montevo-cafe" />
            <div>
              <p className="text-lg font-medium text-montevo-negro">
                Acuerdo {resultado.acuerdo.numero} generado
              </p>
              <p className="text-muted-foreground">El PDF ya se descargó a tu dispositivo.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() =>
                  descargarPdf(
                    resultado.blob,
                    `Acuerdo_${cliente.nombreCliente.replace(/\s+/g, '_')}_${resultado.acuerdo.numero}.pdf`,
                  )
                }
              >
                <Download className="h-4 w-4" />
                Descargar de nuevo
              </Button>
              <Button onClick={() => navigate(`/clientes/${id}`)}>Volver al cliente</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PantallaFirma({
  titulo,
  subtitulo,
  canvasRef,
  error,
  onConfirmar,
  onCancelar,
  confirmarLabel,
}: {
  titulo: string;
  subtitulo?: string;
  canvasRef: React.RefObject<FirmaCanvasHandle>;
  error: string | null;
  onConfirmar: () => void;
  onCancelar: () => void;
  confirmarLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-montevo-crema">
      <div className="flex items-center justify-between gap-3 border-b border-montevo-rosa/60 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold text-montevo-negro">{titulo}</p>
          {subtitulo && <p className="truncate text-sm text-muted-foreground">{subtitulo}</p>}
        </div>
        <button
          type="button"
          onClick={onCancelar}
          aria-label="Cancelar"
          className="shrink-0 rounded-full p-2 text-montevo-negro transition-colors hover:bg-montevo-rosa/40"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        <FirmaCanvas ref={canvasRef} canvasClassName="flex-1" mostrarBotonLimpiar={false} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex gap-3 border-t border-montevo-rosa/60 p-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          size="lg"
          onClick={() => canvasRef.current?.limpiar()}
        >
          Limpiar
        </Button>
        <Button type="button" className="flex-1" size="lg" onClick={onConfirmar}>
          {confirmarLabel}
        </Button>
      </div>
    </div>
  );
}
