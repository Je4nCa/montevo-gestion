import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { getPaquete } from '@/shared/constants/paquetes';
import { MONTEVO_INFO } from '@/shared/constants/montevo';
import type { AcuerdoDocumentData } from '@/shared/types/acuerdo';
import poppinsRegular from '@/assets/fonts/Poppins-Regular.ttf';
import poppinsBold from '@/assets/fonts/Poppins-Bold.ttf';
import notoSansSimbolos from '@/assets/fonts/NotoSans-Regular-Static.ttf';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: poppinsRegular, fontWeight: 400 },
    { src: poppinsBold, fontWeight: 700 },
  ],
});

// Poppins no incluye el glifo ₡ (colón, U+20A1). Noto Sans sí lo tiene y
// se usa únicamente para ese carácter dentro del monto en colones.
Font.register({
  family: 'NotoSansSimbolos',
  fonts: [{ src: notoSansSimbolos, fontWeight: 400 }],
});

const CAFE = '#A67C52';
const CAFE_OSCURO = '#5B4631';
const NEGRO = '#1F1B17';
const ROSA = '#DBC6B2';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9.5,
    color: NEGRO,
    lineHeight: 1.4,
    fontFamily: 'Poppins',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: CAFE,
    paddingBottom: 10,
    marginBottom: 16,
  },
  logo: { fontSize: 18, fontWeight: 700, color: NEGRO },
  logoSub: { fontSize: 8, color: CAFE_OSCURO, letterSpacing: 2, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 11, fontWeight: 700 },
  headerMeta: { fontSize: 8.5, color: CAFE_OSCURO, marginTop: 2 },
  titulo: { fontSize: 13, fontWeight: 700, textAlign: 'center', marginBottom: 4 },
  subtitulo: { fontSize: 9, textAlign: 'center', color: CAFE_OSCURO, marginBottom: 14 },
  parrafo: { marginBottom: 8 },
  bold: { fontWeight: 700 },
  simboloColon: { fontFamily: 'NotoSansSimbolos' },
  clausulaTitulo: {
    fontSize: 10,
    fontWeight: 700,
    color: CAFE_OSCURO,
    marginTop: 10,
    marginBottom: 5,
  },
  tabla: { borderWidth: 1, borderColor: ROSA, marginBottom: 4 },
  filaTabla: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: ROSA },
  filaTablaUltima: { flexDirection: 'row' },
  celdaServicio: {
    width: '35%',
    padding: 5,
    fontWeight: 700,
    borderRightWidth: 1,
    borderRightColor: ROSA,
  },
  celdaDetalle: { width: '65%', padding: 5 },
  encabezadoTabla: { backgroundColor: ROSA, fontWeight: 700 },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
  },
  firmaCol: { width: '45%' },
  firmaImagen: { height: 40, objectFit: 'contain', marginBottom: 2 },
  firmaLinea: { borderTopWidth: 1, borderTopColor: NEGRO, marginTop: 30, marginBottom: 4 },
  firmaNombre: { fontWeight: 700, fontSize: 9.5 },
  firmaRol: { fontSize: 8.5, color: CAFE_OSCURO },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 8,
    color: CAFE_OSCURO,
    borderTopWidth: 1,
    borderTopColor: ROSA,
    paddingTop: 8,
  },
});

function formatMontoPdf(monto: number): string {
  return monto.toLocaleString('en-US');
}

function formatFechaPdf(iso: string): string {
  const [anio, mes, dia] = iso.split('-');
  return `${dia} / ${mes} / ${anio}`;
}

export function AcuerdoDocument({ datos }: { datos: AcuerdoDocumentData }) {
  const paquete = getPaquete(datos.paqueteId);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>montevo</Text>
            <Text style={styles.logoSub}>· S T U D I O ·</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>ACUERDO DE SERVICIOS</Text>
            <Text style={styles.headerMeta}>N.º {datos.numero}</Text>
            <Text style={styles.headerMeta}>Fecha: {formatFechaPdf(datos.fecha)}</Text>
          </View>
        </View>

        <Text style={styles.titulo}>ACUERDO DE PRESTACIÓN DE SERVICIOS DE MARKETING DIGITAL</Text>
        <Text style={styles.subtitulo}>
          Entre Montevo Studio y {datos.clienteSnapshot.nombreCliente}
        </Text>

        <Text style={styles.parrafo}>
          <Text style={styles.bold}>PRESTADOR DE SERVICIOS: </Text>
          {MONTEVO_INFO.nombre}, representado por {MONTEVO_INFO.representanteNombre}, cédula{' '}
          {MONTEVO_INFO.representanteCedula}, con domicilio en {MONTEVO_INFO.domicilio}. En
          adelante, "Montevo Studio".
        </Text>
        <Text style={styles.parrafo}>
          <Text style={styles.bold}>CLIENTE: </Text>
          {datos.clienteSnapshot.nombreCliente}, representado por{' '}
          {datos.clienteSnapshot.representanteNombre}, cédula{' '}
          {datos.clienteSnapshot.representanteCedula}, ubicado en{' '}
          {datos.clienteSnapshot.ubicacion}. En adelante, "el Cliente".
        </Text>
        <Text style={styles.parrafo}>
          Ambas partes acuerdan celebrar el presente contrato de prestación de servicios, sujeto a
          las siguientes cláusulas:
        </Text>

        <Text style={styles.clausulaTitulo}>PRIMERA — OBJETO DEL CONTRATO</Text>
        <Text style={styles.parrafo}>
          Montevo Studio prestará al Cliente servicios de gestión de redes sociales, publicidad,
          diseño de contenido y producción audiovisual, bajo el paquete "{paquete.nombre}", con el
          fin de fortalecer la presencia digital y el crecimiento de marca del Cliente.
        </Text>

        <Text style={styles.clausulaTitulo}>SEGUNDA — SERVICIOS INCLUIDOS</Text>
        <View style={styles.tabla}>
          <View style={[styles.filaTabla, styles.encabezadoTabla]}>
            <Text style={styles.celdaServicio}>Servicio</Text>
            <Text style={styles.celdaDetalle}>Detalle</Text>
          </View>
          {datos.serviciosIncluidos.map((s, i) => {
            const esUltima = i === datos.serviciosIncluidos.length - 1;
            return (
              <View key={s.servicio} style={esUltima ? styles.filaTablaUltima : styles.filaTabla}>
                <Text style={styles.celdaServicio}>{s.servicio}</Text>
                <Text style={styles.celdaDetalle}>{s.detalle}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.clausulaTitulo}>TERCERA — CONTRAPRESTACIÓN ECONÓMICA</Text>
        <Text style={styles.parrafo}>
          {'El Cliente pagará a Montevo Studio la suma de '}
          <Text style={styles.simboloColon}>₡</Text>
          {`${formatMontoPdf(datos.precioMensual)} (${datos.precioEnPalabras}) mensuales, correspondiente a la totalidad del paquete de servicios descrito en la cláusula segunda.`}
        </Text>
        <Text style={styles.parrafo}>
          El pago se realizará mensualmente, dentro de los primeros cinco (5) días naturales de
          cada mes, mediante los siguientes medios, indicando el detalle "PagoMontevo":
        </Text>
        <Text style={styles.parrafo}>— SINPE Móvil: {MONTEVO_INFO.pagos.sinpe}</Text>
        <Text style={styles.parrafo}>— Cuenta BAC: {MONTEVO_INFO.pagos.cuentaBac}</Text>
        <Text style={styles.parrafo}>— IBAN: {MONTEVO_INFO.pagos.iban}</Text>
        <Text style={styles.parrafo}>
          Todas las cuentas se encuentran a nombre de {MONTEVO_INFO.pagos.titular}.
        </Text>

        <Text style={styles.clausulaTitulo}>CUARTA — ENTREGA DE CONTENIDO Y MATERIALES</Text>
        <Text style={styles.parrafo}>
          La producción de contenido es una responsabilidad compartida entre ambas partes:
        </Text>
        <Text style={styles.parrafo}>
          — El Cliente se compromete a aportar información, ideas, promociones, novedades,
          horarios y disponibilidad de espacio y personal para la grabación de fotografías y
          videos en el lugar.
        </Text>
        <Text style={styles.parrafo}>
          — Montevo Studio se compromete a levantar material audiovisual propio en las
          instalaciones del Cliente (fotografías y videos), por iniciativa propia y conforme al
          calendario de contenido acordado, sin depender exclusivamente de que el Cliente provea
          el material.
        </Text>
        <Text style={styles.parrafo}>
          Los retrasos en la entrega de información por parte del Cliente, o la falta de acceso al
          lugar para la grabación programada, podrán afectar los plazos de publicación acordados,
          sin que ello sea responsabilidad de Montevo Studio.
        </Text>

        <Text style={styles.clausulaTitulo}>QUINTA — VIGENCIA Y RENOVACIÓN</Text>
        <Text style={styles.parrafo}>
          El presente acuerdo entra en vigencia a partir de la fecha de firma y se renueva de
          forma automática mes a mes, salvo notificación de cancelación conforme a la cláusula
          sexta.
        </Text>

        <Text style={styles.clausulaTitulo}>SEXTA — CANCELACIÓN</Text>
        <Text style={styles.parrafo}>
          Cualquiera de las partes podrá dar por terminado el presente acuerdo mediante
          notificación escrita con al menos 30 días naturales de anticipación. Los servicios
          correspondientes al mes en curso al momento de la notificación se prestarán con
          normalidad y serán facturados en su totalidad.
        </Text>

        <Text style={styles.clausulaTitulo}>SÉPTIMA — PROPIEDAD DEL CONTENIDO</Text>
        <Text style={styles.parrafo}>
          El contenido audiovisual y gráfico producido para el Cliente bajo este acuerdo será de
          uso exclusivo del Cliente una vez cancelado en su totalidad el mes correspondiente.
          Montevo Studio podrá utilizar dicho material como muestra de portafolio, salvo
          indicación expresa en contrario por parte del Cliente.
        </Text>

        <Text style={styles.clausulaTitulo}>OCTAVA — DISPOSICIONES GENERALES</Text>
        <Text style={styles.parrafo}>
          Este documento constituye el acuerdo completo entre las partes respecto al objeto
          descrito. Cualquier modificación deberá constar por escrito y ser aceptada por ambas
          partes. Este acuerdo se rige por las leyes de la República de Costa Rica.
        </Text>

        <View style={styles.firmas} wrap={false}>
          <View style={styles.firmaCol}>
            {datos.firmaMontevoDataUrl ? (
              <Image src={datos.firmaMontevoDataUrl} style={styles.firmaImagen} />
            ) : null}
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>{MONTEVO_INFO.representanteNombre}</Text>
            <Text style={styles.firmaRol}>{MONTEVO_INFO.nombre}</Text>
          </View>
          <View style={styles.firmaCol}>
            {datos.firmaClienteDataUrl ? (
              <Image src={datos.firmaClienteDataUrl} style={styles.firmaImagen} />
            ) : null}
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>{datos.clienteSnapshot.representanteNombre}</Text>
            <Text style={styles.firmaRol}>
              {datos.clienteSnapshot.nombreCliente} — Representante autorizado
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {MONTEVO_INFO.email} · {MONTEVO_INFO.telefono} · {MONTEVO_INFO.instagram}
        </Text>
      </Page>
    </Document>
  );
}
