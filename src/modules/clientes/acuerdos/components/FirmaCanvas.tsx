import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';

export interface FirmaCanvasHandle {
  obtenerFirma: () => string | null;
  limpiar: () => void;
}

export const FirmaCanvas = forwardRef<FirmaCanvasHandle>(function FirmaCanvas(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      padRef.current?.clear();
    }

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(31, 27, 23)',
    });
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
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
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        className="h-48 w-full touch-none rounded-md border border-input bg-white"
      />
      <Button type="button" variant="outline" size="sm" onClick={() => padRef.current?.clear()}>
        Limpiar
      </Button>
    </div>
  );
});
