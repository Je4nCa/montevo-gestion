import { pdf } from '@react-pdf/renderer';
import { AcuerdoDocument } from '@/modules/clientes/acuerdos/components/AcuerdoDocument';
import type { AcuerdoDocumentData } from '@/shared/types/acuerdo';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generarAcuerdoPdf(
  datos: AcuerdoDocumentData,
): Promise<{ blob: Blob; base64: string }> {
  const blob = await pdf(<AcuerdoDocument datos={datos} />).toBlob();
  const base64 = await blobToBase64(blob);
  return { blob, base64 };
}

export function descargarPdf(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function base64ToBlob(base64: string): Blob {
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i);
  }
  return new Blob([buffer], { type: 'application/pdf' });
}
