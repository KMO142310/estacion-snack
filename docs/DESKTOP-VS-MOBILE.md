# Desktop vs Mobile — Plan de diferenciacion

Estado actual: grilla 2-col mobile, 3-col desde 640px. Misma experiencia en ambos. Sticky bar y Bnav se ocultan en desktop con `display:none`. El header es identico. No hay hover states reales mas alla de `translateY(-3px)` en cards.

---

## 1. Desktop (>=768px) — cambios concretos

### Layout de productos: 3 columnas con producto destacado
```
[  DESTACADO (2 cols)  ] [ Card normal ]
[ Card ]  [ Card ]  [ Card ]
         [ Card ]
```
- El producto con `badge: "Top ventas"` ocupa 2 columnas con imagen mas grande + copy visible sin abrir sheet.
- Las 5 cards restantes en grid 3-col normal.
- CSS: `.product-grid { grid-template-columns: repeat(3, 1fr); }` + `.product-grid > :first-child { grid-column: span 2; }`.

### Hover states reales en cards
- Hover muestra overlay semitransparente con copy corto (`product.copy`) + boton "Ver detalle".
- Hover en boton "Agregar 1 kg" cambia background a `--terracota-dark`.
- Ya existe `@media (hover:hover)` en globals.css — usar eso.

### Producto detalle: modal centrado, no bottom sheet
- En mobile el `ProductSheet` sube desde abajo (bottom sheet). En desktop: modal centrado tipo dialog, max-width 640px, con imagen a la izquierda y contenido a la derecha (2 cols dentro del modal).
- Quitar `drag="y"` en desktop (no tiene sentido arrastrar un modal centrado).

### Navegacion: mini-cart en header, no sticky bar
- La sticky bar inferior ya se oculta en desktop (`@media (min-width: 768px) { .sticky-bar { display:none } }`).
- El boton de carrito del Header ya existe y muestra badge de cantidad — es suficiente.
- Agregar: al hacer hover en el boton de carrito, mostrar dropdown con resumen del pedido (items + total + boton "Confirmar pedido").

### Secciones mas anchas
- `maxWidth: 1100px` del `.container` esta bien. Pero las secciones de copy (TrustBar, FAQ, ComoFunciona) pueden usar 2-3 columnas en vez de una sola columna centrada.
- FAQ en desktop: 2 columnas de preguntas.

---

## 2. Mobile (<768px) — cambios concretos

### Bottom sheet es el patron correcto, mantenerlo
- El `ProductSheet` actual con drag-to-dismiss, spring animation y chips de cantidad es buen UX mobile. No cambiar.

### Sticky bar: hacerla mas contextual
- Estado actual: siempre visible, dice "Pedido vacio" cuando no hay items. Eso desperdicia espacio.
- Cambio: si `itemCount === 0`, no mostrar sticky bar. Mostrarla solo cuando hay items.
- Cuando aparece, animarla con `translateY` desde abajo.

### Scroll horizontal de packs: ya existe, esta bien
- `PackSection` ya usa scroll-snap horizontal. Es el patron correcto para mobile con pocos items.

### Quick-add mejorado
- El boton "Agregar 1 kg" en la card ya funciona. Agregar feedback visual: el boton hace un scale-bounce breve al agregar.
- Considerar: despues de agregar, el boton muestra "2 kg" / "3 kg" para incrementar en vez de volver a "Agregar 1 kg".

---

## 3. Implementacion en Next.js — enfoque practico

### NO hacer component switching (no renderizar componentes distintos por breakpoint)
- Con 6 productos y componentes ligeros, la diferencia de bundle no justifica la complejidad.
- Usar **CSS media queries + clases condicionales**. Ya lo hacen con `.bnav-mobile` y `.sticky-bar`.

### Patron recomendado: CSS + un hook para logica distinta

```tsx
// lib/useIsDesktop.ts
"use client";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false // SSR: asumir mobile-first
  );
}
```

Usar `useIsDesktop()` solo para cambiar **comportamiento**, no layout:
- En `ProductSheet`: si desktop, renderizar como modal centrado en vez de bottom sheet.
- En `Header`: si desktop, habilitar hover-dropdown del carrito.
- En `ProductCard`: si desktop, mostrar overlay con copy en hover.

El layout (grid columns, padding, tamanios) va **siempre** con CSS media queries en los `<style>` tags o en `globals.css`.

### Cambios minimos en archivos existentes

| Archivo | Cambio |
|---------|--------|
| `globals.css` | Agregar media query para `.product-grid` 3-col con featured |
| `ProductCard.tsx` | Agregar div con copy que se muestra en hover via CSS |
| `ProductSheet.tsx` | Condicionar posicion (bottom sheet vs modal centrado) con `useIsDesktop` |
| `PageShell.tsx` | Ocultar sticky bar cuando carrito vacio |
| `Header.tsx` | Agregar dropdown de carrito en hover (solo desktop) |
| `components/FAQ section` | CSS 2-col en desktop para las preguntas |

---

## Resumen de prioridades

1. **Alto impacto, poco codigo**: ocultar sticky bar con carrito vacio + hover states en cards.
2. **Medio impacto**: modal centrado en desktop para ProductSheet + featured product grande.
3. **Bajo prioridad**: hover dropdown de carrito en header + FAQ 2 columnas.
