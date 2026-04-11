# Catálogo de componentes — Estación Snack

Todos los componentes viven en `components/`. Salvo mención explícita, son
Client Components (`"use client"`). Los Server Components se marcan como tal.

---

## Layout y navegación

### `Header`
Barra superior sticky con glassmorphism (backdrop-filter blur). Muestra el logo,
navegación de escritorio (oculta en mobile), botón de WhatsApp directo, y botón
de carrito con contador de ítems.

- **Props**: `onCartOpen: () => void`
- **Estado**: `scrolled` (reduce padding al hacer scroll)
- **Consume**: `useCart()` para el contador

### `Bnav`
Barra de navegación bottom-fixed para mobile. Se oculta en `≥768px`.
Tiene links a Inicio, FAQ, y el botón "Pedir" que abre el Drawer.

- **Props**: `onCartOpen: () => void`
- **Accesibilidad**: `aria-label="Navegación principal"` en `<nav>`

### `Footer`
Pie de página con links de navegación, redes sociales, y aviso legal.
Componente estático sin props.

### `Announce`
Banner dismissible en la parte superior (debajo de Header). Calcula y muestra
el próximo día de despacho (martes o viernes) dinámicamente.

- **Estado**: `visible` (se oculta al hacer clic en ✕)
- **Accesibilidad**: `role="status"`, `aria-live="polite"`

---

## Home — secciones

### `PageShell`
Shell de la home que contiene todas las secciones y gestiona el estado del Drawer.
Recibe los productos cargados por el Server Component (`app/page.tsx`) y los
distribuye a los componentes que los necesitan.

- **Props**: `products: Product[]`
- **Estado**: `drawerOpen`

### `Hero`
Sección hero principal con headline, copy, y CTA a la sección de productos.
Componente estático sin props.

### `Benefits`
Grilla de 3-4 tarjetas con los beneficios de comprar en Estación Snack
(calidad, frescura, despacho). Estático.

### `Marquee`
Banda animada con texto deslizante horizontal (categorías, claims). Estático.

### `Combos`
Sección de packs/combos. Filtra `products` con `category === 'pack'` o similar
y los muestra en un layout horizontal.

- **Props**: `products: Product[]`

### `ProductGrid`
Grilla principal del catálogo. Filtra por `is_active` y renderiza un `ProductCard`
por producto. Layout responsive con `auto-fill minmax(280px, 1fr)`.

- **Props**: `products: Product[]`

### `Testimonials`
Sección de testimonios de clientes reales. Estático.

### `About`
Sección "Quiénes somos" con la historia y valores de Estación Snack. Estático.

### `FAQ`
Lista de preguntas frecuentes con expand/collapse. Responde dudas de despacho,
formatos, y pagos.

### `CTA`
Call-to-action final antes del footer. Botón que abre el Drawer o redirige a WhatsApp.

- **Props**: `onCartOpen: () => void`

---

## Carrito y checkout

### `Drawer`
Drawer lateral de carrito y checkout. Es el componente más complejo del proyecto.

**Flujos internos**:
1. `step = "cart"` — lista los ítems del carrito con controles de cantidad.
2. `step = "checkout"` — formulario de datos del cliente (nombre, teléfono, comuna, notas).
3. `step = "success"` — confirmación con el link de WhatsApp generado.

**Funcionalidades clave**:
- `normalizePhone(raw)` — convierte cualquier formato chileno a `+569XXXXXXXX`.
- `isValidChileanPhone(raw)` — valida el formato normalizado.
- Selector de comunas de la Región de O'Higgins (34 opciones, default: Santa Cruz).
- `aria-invalid` en inputs, `role="alert"` en mensajes de error.
- `autoComplete="name"/"tel"` para autocompletar del browser.
- Llama a `placeOrder` (server action) y emite eventos GA4 + Meta Pixel.

- **Props**: `open: boolean`, `onClose: () => void`, `products: Product[]`
- **Consume**: `useCart()`, `placeOrder` (server action), `trackBeginCheckout`, `trackPurchase`

### `ProductCard`
Tarjeta de producto en la grilla. Muestra imagen (con WebP fallback via `<picture>`),
nombre, copy (2 líneas truncadas), precio/kg, indicador de stock, y controles
de cantidad inline (−/+ en pasos de 0.5 kg).

- **Props**: `product: Product`
- **Estado**: `loading` (durante llamadas async al carrito)
- **Consume**: `useCart()`
- **Accesibilidad**: `aria-label` en el link de imagen, `loading="lazy"` en img

---

## Producto detalle

### `ProductDetail` (`app/producto/[slug]/ProductDetail.tsx`)
Página de detalle de producto. Grilla 1-col en mobile, 2-col en ≥768px.

**Secciones**:
- Breadcrumb con `aria-label="Ruta de navegación"`.
- Imagen principal con WebP fallback.
- Badge (opcional), categoría, nombre, precio/kg, estado de stock.
- Selector de cantidad (botones para 0.5, 1, 1.5, 2, 3 kg) + botón "Agregar al pedido".
- Si ya está en el carrito: controles −/+ + botón "Ver pedido".
- `long_description` (texto libre multi-párrafo, si existe).
- Tabla nutricional por 100g (si `product.nutrition` no es null/vacío).
- Info de despacho.
- Sección "También te puede gustar" con productos relacionados.

- **Props**: `product: Product`, `related: Product[]`
- **Consume**: `useCart()`, `trackViewItem`

---

## Analytics

### `AnalyticsScripts` (Server Component — sin `"use client"`)
Inyecta los scripts de GA4 y Meta Pixel con `strategy="afterInteractive"`.
No necesita estado ni APIs del browser, por lo que no lleva `"use client"` y
renderiza en el servidor (Next.js App Router). Solo emite scripts si las env
vars correspondientes están definidas; si faltan ambas, no agrega nada al DOM.

- **Sin props**
- **Lee**: `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`

---

## Admin

Los componentes de admin viven en `app/admin/(gated)/` y son parte de las rutas,
no de `components/`. Se listan acá por completitud.

### `StockEditor` (`app/admin/(gated)/productos/StockEditor.tsx`)
Tabla editable de productos. Columnas: miniatura, nombre+categoría, precio, stock (editable),
estado derivado, botón guardar, toggle is_active.

- Edición inline de stock: click en la celda → input numérico → Enter/Guardar.
- Toggle is_active con actualización optimista (revert en error).
- Botón "+ Nuevo producto" abre `ProductForm`.
- Botón "Editar" por fila abre `ProductForm` con los datos del producto.

### `ProductForm` (`app/admin/(gated)/productos/ProductForm.tsx`)
Modal de creación/edición de producto. Campos: nombre, slug (auto-generado desde
nombre), categoría, precio, stock, color (picker de 6 opciones), copy corto,
descripción larga, información nutricional, is_active.

Llama al server action `upsertProduct`. Cierra con `onSaved()` que dispara
`window.location.reload()` para revalidar los datos.

### `PedidosFilter` (`app/admin/(gated)/pedidos/PedidosFilter.tsx`)
Chips de filtro por estado de pedido con badges de conteo. Filtra la lista
de pedidos en el cliente (sin round-trip al servidor).

### `OrderRow` (`app/admin/(gated)/pedidos/OrderRow.tsx`)
Fila expandible de pedido. Muestra datos del cliente, ítems, total, y un
textarea de notas internas que se guarda vía `updateOrderNotes` server action.
