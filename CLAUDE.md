# Montevo Gestión — Contexto del proyecto

Aplicación interna de gestión de clientes para **Montevo Studio**, estudio
creativo/tech fundado por Jean Carlo Villamonte Murillo (Jean Ca), con sede
en Costa Rica. Montevo Studio ofrece servicios en cuatro frentes —
Estrategia, Diseño, Sistemas y Crecimiento — bajo la propuesta "menos
complicaciones, más resultados". Uso individual (el dueño), sin múltiples
sucursales ni empleados por ahora.

**Objetivo del MVP:** llevar un control centralizado de los clientes activos
de Montevo Studio: fecha de inicio del acuerdo, paquete contratado,
publicaciones usadas/disponibles del mes, redes sociales del cliente, día de
pago, método de pago, acuerdos particulares, datos del cliente y de su
representante, y quién califica para descuentos en add-ons. Debe permitir
siempre crear, editar y eliminar clientes.

**Nota:** este proyecto es independiente — no reutiliza ni copia código de
ningún otro proyecto previo. Esta es una base nueva.

---

## Negocio: Montevo Studio

- **Propuesta de valor:** soluciones digitales y estrategias que simplifican
  procesos, impulsan marcas y hacen crecer negocios. "Menos complicaciones,
  más resultados."
- **Frentes de servicio:** Estrategia, Diseño, Sistemas, Crecimiento
- **Mascota:** Montevito (personaje triángulo negro/café con ojos, usado en
  ilustraciones de la marca — ver `assets/Montevito.png`)
- **Redes:** @montevo.studio (Instagram, Facebook, LinkedIn, WhatsApp,
  YouTube, TikTok)
- Assets de marca completos en `assets/MontevoStudio_BrandKit_Oficial.pdf`

### Paleta de marca (usar en `tailwind.config.ts`, nunca hardcodeada)

| Nombre        | Hex       | Uso                          |
|---------------|-----------|-------------------------------|
| Negro marca   | `#1F1B17` | texto principal, fondos oscuros |
| Café oscuro   | `#5B4631` | acentos, botones secundarios |
| Café/terracota| `#A67C52` | color de marca principal (CTA, acentos) |
| Rosa/beige    | `#DBC6B2` | superficies suaves, badges |
| Crema         | `#F2ECE6` | fondo general de la app |
| Negro puro    | `#111111` | texto de alto contraste |

### Tipografías

- **Títulos:** Noe Display
- **Cuerpo:** Poppins

### Paquetes de servicios (catálogo base — `src/shared/constants` o similar)

Precios en colones (₡), mensuales. Cada nivel incluye todo lo del anterior
más lo listado:

1. **Esencial** — ₡25.000/mes — 4 publicaciones, 2 reels, diseño gráfico,
   calendario de contenido básico
2. **Emprendedor** — ₡50.000/mes — gestión de redes, 8 publicaciones,
   4 reels, diseño gráfico, estrategia mensual, calendario de contenido,
   asesoría personalizada, reporte de resultados. *Descuentos exclusivos en
   add-ons.*
3. **Profesional** — ₡85.000/mes — 12 publicaciones, 6 reels, landing page
   (1 página), 1 campaña de ads/mes gestionada (pauta aparte), branding
   básico si no lo tienen. *Add-on POS con 15% de descuento.*
4. **Negocio** — ₡140.000/mes — 16 publicaciones, 8 reels, página web
   multipágina, POS/sistema de ventas (módulo base), sistema de inventario
   básico. *POS e inventario incluidos.*
5. **Corporativo** — ₡230.000/mes — inventario completo multiplataforma,
   POS multiusuario/multisucursal, analítica avanzada, automatizaciones
   múltiples, soporte prioritario, contenido ilimitado (razonable), reunión
   estratégica mensual. *Experiencia premium.*

**Add-ons disponibles** (algunos clientes califican para descuento según su
paquete): página web adicional, sistema de facturación, sistema de
inventarios, automatizaciones específicas, branding avanzado, campañas
publicitarias, soporte prioritario.

---

## Stack tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** TailwindCSS + shadcn/ui (Radix UI) — sin CSS inline, sin CSS modules
- **Estado:** Zustand
- **Backend:** Firebase — Auth (email/contraseña, dueño único) + Firestore
  (`negocio/{uid}/clientes`, `negocio/{uid}/publicaciones`), conectado desde
  `src/shared/lib/firebase.ts`. Reglas de seguridad en `firestore.rules`
  (raíz del repo) — solo el usuario autenticado con ese `uid` puede leer/
  escribir sus propios datos.
- **Gráficos:** Recharts (para reportes/dashboards)
- **Animaciones:** Framer Motion
- **Multiplataforma:** Capacitor (iOS/Android) — configurar después de tener
  la web estable, no desde el inicio
- **CI/CD:** GitHub Actions → GitHub Pages o Firebase Hosting

No agregar librerías nuevas sin justificar por qué el stack de arriba no alcanza.

---

## Principio de arquitectura

Todo cuelga del `uid` del negocio/usuario dueño de los datos. Los módulos no
se importan entre sí directamente — se comunican a través de hooks
compartidos y un perfil central.

```
negocio/{uid}
  /clientes
  /productos       (o /servicios, según tu rubro)
  /ventas
  /gastos
  /reportes
```

Cada módulo tiene su propio hook principal (`useClientes`, `useVentas`, etc.)
que abstrae la fuente de datos (Firestore, vía `onSnapshot`) — los
componentes **nunca** llaman a Firestore directamente, siempre pasan por
el hook.

Estructura de carpetas:

```
src/
  modules/
    auth/
    clientes/
    productos/
    ventas/
    gastos/
    reportes/
    admin/
  shared/
    components/
    hooks/
    types/
    lib/          # abstracción de base de datos, utils, constantes
  router/
```

---

## Módulos de la app

- **Auth:** Firebase Authentication con Google Sign-In (`signInWithPopup`),
  restringido a un único correo (`src/shared/constants/auth.ts`) tanto en
  cliente como en `firestore.rules` — no hay registro público
- **Clientes (módulo principal del MVP):**
  - Ficha de cliente: nombre del negocio/cliente, datos de contacto,
    representante (nombre, cargo, teléfono, email)
  - Acuerdo: fecha de inicio, paquete contratado, add-ons activos, si
    califica para descuento en add-ons
  - Publicaciones: cantidad incluida según paquete, publicaciones usadas del
    período, publicaciones restantes (calculado)
  - Redes sociales del cliente (Instagram, Facebook, TikTok, etc. — enlaces)
  - Pagos: día de pago acordado, método de pago, estado (al día / pendiente)
  - Notas/acuerdos particulares (texto libre)
  - CRUD completo: crear, editar, eliminar/desactivar cliente
- **Reportes (futuro, no MVP):** clientes por paquete, publicaciones
  pendientes, próximos pagos
- **Admin (futuro):** configuración general, catálogo de paquetes editable

---

## Diseño

- Define una paleta de marca (3-5 colores) y dos tipografías (una para UI,
  una decorativa opcional) — todo en `tailwind.config.ts`, nunca hardcodeado
  en componentes
- Mobile-first, responsive en todos los breakpoints de Tailwind (`sm`, `md`,
  `lg`, `xl`) — probar siempre en móvil y escritorio antes de dar por
  terminada una pantalla
- UI accesible: texto nunca menor a `text-base`, alto contraste, botones y
  áreas táctiles grandes, lenguaje simple, flujos cortos con confirmaciones
  claras

---

## Seguridad (no negociable)

- **Nunca** exponer credenciales sensibles (API keys de pago, contraseñas de
  servicios, tokens con permisos de escritura) en el código del frontend —
  si una integración lo requiere, debe pasar por un backend/Cloud Function,
  nunca directo desde el navegador
- Sanitizar **todo** texto libre de usuario antes de:
  - insertarlo en cualquier plantilla de correo (EmailJS, etc.) — escapar
    HTML para evitar inyección de scripts/enlaces
  - usarlo en campos tipo cabecera (email, asunto) — quitar saltos de línea
    para evitar inyección de cabeceras
  - guardarlo si en el futuro hay backend con SQL — usar siempre consultas
    parametrizadas, nunca concatenar strings
- Variables sensibles siempre vía `.env.local` (gitignorado) en desarrollo y
  GitHub Actions secrets en producción — nunca hardcodeadas
- Sin `dangerouslySetInnerHTML`, `eval`, ni ejecución de comandos con texto
  de usuario en ningún punto de la app

---

## Reglas de código

- Sin `any` en TypeScript — usar `unknown` con guard si no se conoce la forma
- Todos los accesos a base de datos van en hooks, nunca en componentes
- Componentes funcionales únicamente
- Hooks de datos manejan siempre tres estados: `loading`, `error`, `data`
- Error boundaries a nivel de ruta
- Sin abstracciones ni features que la tarea actual no pida — priorizar
  simplicidad sobre flexibilidad especulativa

---

## Primeras tareas

1. Configurar `tailwind.config.ts` con la paleta y tipografías de Montevo
2. Crear la estructura de carpetas `src/modules/` (empezar con `clientes`,
   dejar `auth` y `admin` mínimos)
3. Crear `src/shared/lib/firebase.ts` con la inicialización de Firebase,
   y el catálogo de paquetes como constante (`src/shared/constants/paquetes.ts`)
4. Construir el shell de la app: navegación simple (Clientes como pantalla
   principal)
5. Implementar el flujo de auth con Firebase Authentication (login del dueño)
6. Módulo Clientes completo: listado, ficha de detalle, formulario de
   crear/editar, cálculo de publicaciones restantes
