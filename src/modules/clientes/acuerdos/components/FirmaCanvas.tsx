import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

export interface FirmaCanvasHandle {
  obtenerFirma: () => string | null;
  limpiar: () => void;
}

interface FirmaCanvasProps {
  canvasClassName?: string;
  mostrarBotonLimpiar?: boolean;
}

export const FirmaCanvas = forwardRef<FirmaCanvasHandle, FirmaCanvasProps>(function FirmaCanvas(
  { canvasClassName, mostrarBotonLimpiar = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const datosPrevios = padRef.current?.toData();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      padRef.current?.clear();
      if (datosPrevios && datosPrevios.length > 0) {
        padRef.current?.fromData(datosPrevios);
      }
    }

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(31, 27, 23)',
    });
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      padRef.current?.off();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    obtenerFirma: () => {
      if (!padRef.current || padRef.current.isEmpty()) return null;
      return padRef.current.toDataURL('image/png');
    },
    limpiar: () => padRef.current?.clear(),
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <canvas
        ref={canvasRef}
        className={cn(
          'min-h-0 w-full touch-none rounded-md border border-input bg-white',
          canvasClassName ?? 'h-48',
        )}
      />
      {mostrarBotonLimpiar && (
        <Button type="button" variant="outline" size="sm" onClick={() => padRef.current?.clear()}>
          Limpiar
        </Button>
      )}
    </div>
  );
});
