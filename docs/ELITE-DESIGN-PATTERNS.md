# Patrones de Diseño Elite — Estacion Snack

Extraido de: Graza, Aesop, Blue Bottle Coffee, Awwwards winners 2025-2026.
Cada linea es un cambio aplicable. Sin teoria.

---

## 1. Escala tipografica (ratio 1.333 — Perfect Fourth)

ACTUAL: todo entre 13-15px, jerarquia plana. ELITE: contraste dramatico.

```
--fs-micro:   0.6875rem;  /* 11px — etiquetas, legal */
--fs-small:   0.8125rem;  /* 13px — meta, badges */
--fs-body:    1rem;        /* 16px — cuerpo, descripciones */
--fs-lead:    1.125rem;    /* 18px — intro de seccion */
--fs-h3:      1.5rem;      /* 24px — subtitulos */
--fs-h2:      clamp(2rem, 5vw, 2.75rem);   /* 32-44px — titulos seccion */
--fs-h1:      clamp(3rem, 10vw, 5rem);      /* 48-80px — hero */
--fs-display: clamp(3.5rem, 12vw, 6.5rem);  /* 56-104px — statement */
```

**Cambio concreto en `globals.css`**: agregar estas variables al bloque `@theme inline`.
**En Hero.tsx**: el h1 ya usa clamp similar — OK. Pero el subtitulo "Por kilo, desde Santa Cruz" esta en 1rem, subir a `--fs-lead` (18px).
**En ProductCard.tsx**: nombre del producto en 14px es muy chico. Subir a 15-16px (--fs-body).
**En TrustBar.tsx**: titulo "Por kilo" esta en 0.875rem. Subir a 1rem con font-weight 700.

---

## 2. Spacing entre secciones (sistema 8px, secciones en 96-120px)

ACTUAL: padding inconsistente — "20px 16px", "40px 16px", "48px 20px", "5rem 0". ELITE: ritmo predecible.

```
--space-section:    clamp(80px, 10vw, 120px);  /* entre secciones */
--space-section-sm: clamp(48px, 6vw, 72px);    /* dentro de secciones */
--space-block:      clamp(32px, 4vw, 48px);     /* entre bloques de contenido */
--space-element:    clamp(16px, 2vw, 24px);     /* entre elementos */
```

**Cambio concreto en PageShell.tsx**:
- Seccion `#productos`: padding de `20px 16px 24px` → `var(--space-section) var(--edge-pad)`
- FAQ section: padding de `40px 16px 32px` → `var(--space-section-sm) var(--edge-pad)`
- CTA cierre: padding de `48px 20px` → `var(--space-section) var(--edge-pad)`
- Cada seccion debe tener padding vertical IDENTICO o con ratio 1:1.5 intencional

---

## 3. TrustBar: eliminar iconos genericos, usar tipografia

PATRON ELITE (Aesop, Blue Bottle): NO usan icon bars con iconos de linea. Usan:
- Solo texto con jerarquia tipografica fuerte
- O numeros/datos como "statement" visual
- O un separador editorial minimo

**Rediseno TrustBar.tsx — enfoque "editorial numbers":**

```tsx
// Reemplazar iconos SVG por numeros tipograficos grandes
const items = [
  { num: "1kg", title: "Por kilo", desc: "Bolsas de 1 kg. Sin envases chicos." },
  { num: "6d", title: "Martes a sabado", desc: "19:30 a 21:00. Santa Cruz y alrededores." },
  { num: "2m", title: "Pedido en WhatsApp", desc: "Te respondemos nosotros mismos." },
];

// El numero grande (font-display, 2.5rem, color terracota, font-weight 700)
// reemplaza al icono — genera mas impacto visual y es unico.
// Eliminar borderRight entre items, usar gap de 2rem.
// Padding vertical: 3rem (no 2.5rem).
```

**O enfoque "texto puro" (estilo Aesop):**
- Sin iconos, sin numeros. Solo 3 frases en una linea horizontal.
- font-display para el titulo, font-body para la descripcion.
- Separadas por un punto medio (·) o pipe (|) con color atenuado.
- `Vendido por kilo · Despacho mar-sab · Pedido por WhatsApp`

---

## 4. Transiciones entre secciones (color blocks, no lineas)

PATRON ELITE (Graza): alternar fondos de seccion. No usar borderBottom.

ACTUAL: casi todo sobre `#F4EADB` (crema). Monotono.

**Secuencia propuesta:**
1. Hero → fondo oscuro (#5A1F1A) — ya OK
2. Promo banner → terracota (#D0551F) — ya OK
3. TrustBar → crema (#F4EADB) → **cambiar a blanco (#FFFFFF)**
4. Productos → **crema (#F4EADB)** — OK
5. Packs → **blanco (#FFFFFF)** — ya OK
6. ComoFunciona → oliva (#5E6B3E) — ya OK
7. FAQ → **crema claro (#F9F3E8)** (nuevo tono, mas calido)
8. CTA cierre → burdeo (#5A1F1A) — ya OK

**Eliminar** `borderBottom: "1px solid rgba(90,31,26,0.10)"` del TrustBar.
El cambio de color de fondo ES el separador. Las lineas son un fallback de estudiante.

---

## 5. Product Cards — imagen dominante, info minima

PATRON ELITE (Graza, Aesop): la imagen ocupa 75-80% del card. La info es residual.

ACTUAL en ProductCard.tsx: aspect-ratio 1/1 para imagen, luego padding "10px 10px 12px" para info. Proporcion ~60/40.

**Cambios concretos:**
- Imagen: cambiar `aspectRatio: "1/1"` → `aspectRatio: "4/5"` (retrato, mas premium)
- Info padding: de `10px 10px 12px` → `14px 14px 16px`
- Nombre producto: fontSize de 14 → 16, fontWeight 600 (ya OK)
- Precio: fontSize de 14 → 15
- Badge: fontSize de 9 → 10, padding de `3px 8px` → `5px 10px`
- Border del card: de `rgba(90,31,26,0.06)` → eliminarlo. Usar solo `box-shadow: 0 1px 3px rgba(90,31,26,0.06)`
- Border-radius: de 16 → 12 (mas tenso, menos "burbuja")

---

## 6. Grid de productos — gap y columnas

ACTUAL: `gap: 12px` mobile, `16px` desktop. Muy apretado para premium.

**Cambios en PageShell.tsx (style tag):**
```css
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;           /* era 12px */
}
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;          /* era 16px — Graza usa 20px+, Aesop 24-32px */
  }
}
```

---

## 7. Ritmo visual — variacion intencional de densidad

PATRON ELITE: no todo tiene el mismo peso. Alternar secciones densas con "respiros".

**Insertar un TextBreak editorial entre Productos y Packs:**
Ya existe `components/TextBreak.tsx`. Usarlo con copy tipo:
> "Seis mezclas. Las probamos todas hasta dejar solo las que uno se termina sin darse cuenta."

Esto crea un RESPIRO entre dos secciones densas (grid + carousel).

**Insertar un Marquee o editorial-sep entre ComoFunciona y FAQ.**
Ya existe `components/EditorialMarquee.tsx`. Activarlo.

---

## 8. Botones — menos shadow, mas presencia

ACTUAL: `boxShadow: "0 6px 24px rgba(208,85,31,0.42)"` en Hero CTA. Demasiado.
ELITE (Aesop): botones sin sombra, solo color solido + hover sutil.

**Cambios:**
- Hero CTA: reducir shadow a `0 2px 12px rgba(208,85,31,0.20)` o eliminarlo
- Border-radius de botones: de 10px → 8px (mas tenso) o 999px (pill, como Aesop)
- Elegir UNO y ser consistente en todo el sitio
- ProductCard boton "Agregar": borderRadius de 10 → 8 para match

---

## 9. FAQ section — elevar tipografia del titulo

ACTUAL: titulo "Preguntas frecuentes" en fontSize 11, uppercase, weight 600. Se pierde.

**Cambiar a:**
```tsx
<h2 style={{
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: "clamp(1.75rem, 5vw, 2.25rem)", // era 11px label
  color: "#5A1F1A",
  lineHeight: 1.15,
  marginBottom: "2rem", // era 16px
}}>
  Preguntas frecuentes
</h2>
```
Eliminar el uppercase/letterSpacing de label generico. Darle rango de H2 real.

---

## 10. Footer — mas aire, menos densidad

ACTUAL: padding `3rem 0 1.5rem`. Grid apretado con gap 2rem.

**Cambios:**
- Padding: `4.5rem 0 2rem`
- Gap del grid: de `2rem` → `3rem`
- Agregar `paddingTop: "3rem"` al bloque inferior (copyright)
- La marca "estacion snack" en el footer: subirla a `1.5rem` (era 1.25rem)

---

## 11. Color — agregar un tono intermedio

ACTUAL: solo crema (#F4EADB) y blanco (#FFF). No hay "crema calido".

**Agregar en globals.css:**
```css
--color-crema-warm: #F9F3E8;  /* entre crema y blanco, para FAQ y secciones alternas */
--color-surface-warm: #FDF8F0; /* para cards en contextos crema */
```

---

## 12. Line-height — sistema consistente

ACTUAL: line-height varia entre 1.04, 1.15, 1.2, 1.3, 1.5, 1.55, 1.6, 1.65. Sin sistema.

**Sistema elite (3 valores):**
```
--lh-tight:  1.1;   /* h1, display, hero */
--lh-snug:   1.3;   /* h2, h3, titulos de card */
--lh-body:   1.6;   /* body text, descripciones, parrafos */
```

Aplicar estos 3 valores en TODOS los componentes. Eliminar variaciones intermedias.

---

## Prioridad de implementacion

1. **Escala tipografica** (seccion 1) — mayor impacto, menor riesgo
2. **Spacing entre secciones** (seccion 2) — el sitio respira de inmediato
3. **TrustBar sin iconos** (seccion 3) — elimina la sensacion "template"
4. **Color blocks** (seccion 4) — ritmo visual automatico
5. **Product cards** (seccion 5-6) — imagen premium
6. **Respiros editoriales** (seccion 7) — rompe monotonia
7. **FAQ titulo** (seccion 9) — quick win
8. **Botones** (seccion 8) — consistencia
9. **Footer** (seccion 10) — polish final
10. **Line-height** (seccion 12) — sistematico, hacer al final
