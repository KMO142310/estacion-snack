# Propuestas de Identidad de Marca — Estación Snack

Estado actual: el header dice "Estación Snack" en Fraunces plano. Sin isotipo visible, sin tratamiento tipográfico que lo distinga de un título cualquiera. El componente `Logo.tsx` existe con un isotipo SVG (almendra con corte), pero el Header no lo usa.

---

## 1. Tratamientos de Wordmark (CSS + SVG, sin diseñador)

### Opción A — "Peso Diferencial" (la más rápida de implementar)

Jugar con el contraste de peso dentro del mismo nombre. Referencia: Graza usa este principio.

```css
.wordmark {
  font-family: var(--font-display); /* Fraunces */
  font-size: 19px;
  letter-spacing: -0.02em;
  line-height: 1;
}
.wordmark-main { font-weight: 800; color: #F4EADB; }
.wordmark-sub  { font-weight: 300; color: #F4EADB; opacity: 0.55; }
```

Resultado visual: **estación** snack — el contraste 800 vs 300 crea jerarquía inmediata.

### Opción B — "Tilde como Marca" (la más original)

El acento de la "ó" en "Estación" es un activo visual único. Convertirlo en un elemento gráfico: una almendra estilizada, una línea curva naranja (#D0551F), o un trazo de pincel.

```tsx
<span className="wordmark">
  estaci<span style={{ position: "relative" }}>
    o
    <svg style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)" }}
         width="10" height="6" viewBox="0 0 10 6">
      <path d="M2,5 Q5,0 8,5" stroke="#D0551F" strokeWidth="2"
            fill="none" strokeLinecap="round"/>
    </svg>
  </span>n snack
</span>
```

Esto convierte un carácter tipográfico en un elemento de marca reconocible. La tilde-almendra aparece en el logo, el favicon, el packaging, las bolsas.

### Opción C — "Estación Apilada" (presencia de marca fuerte)

Dos líneas: ESTACIÓN grande arriba, SNACK más pequeño abajo con tracking amplio.

```css
.logo-stacked {
  font-family: var(--font-display);
  line-height: 0.85;
  color: #F4EADB;
}
.logo-stacked-top  { font-weight: 800; font-size: 22px; display: block; }
.logo-stacked-bot  { font-weight: 400; font-size: 11px; letter-spacing: 0.25em;
                      text-transform: uppercase; display: block; opacity: 0.5; }
```

Referencia: marcas como NotCo y Grüns usan esta jerarquía apilada. Funciona bien para redes sociales y packaging.

### Opcion D — "Isotipo Integrado" (usar lo que ya tienen)

El isotipo almendra de `Logo.tsx` ya existe y es bueno. El problema es que el Header no lo usa. Integrarlo al lado del wordmark crea un conjunto completo.

```tsx
// En Header.tsx, reemplazar el <a> actual por:
<Logo variant="horizontal" size="sm" inverted />
```

Un solo cambio. El isotipo ovalado + el wordmark en Fraunces ya forman un logo real.

---

## 2. Favicon

El favicon actual (`favicon.svg`) usa el isotipo almendra sobre fondo #5A1F1A. Es correcto pero tiene poco contraste a 16x16px.

**Propuesta**: simplificar a la inicial **E** en Fraunces bold sobre el fondo marca.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#5A1F1A"/>
  <text x="16" y="23" text-anchor="middle" font-family="Georgia,serif"
        font-weight="800" font-size="22" fill="#F4EADB">E</text>
</svg>
```

**Alternativa**: si se elige la Opción B (tilde-almendra), usar solo la tilde curva naranja sobre fondo oscuro como favicon. Esto es ultra-reconocible y minimalista.

---

## 3. Elementos de Identidad Más Allá del Logo

### Color blocking como firma
Usar el fondo #5A1F1A (burdeo oscuro) de forma consistente como "el color de Estación Snack". Es un color poco común en snacks (donde dominan rojos brillantes y amarillos). Esa diferenciación ya existe, hay que ser conscientes de ella.

### Acento naranja como sistema
El #D0551F ya se usa en badges y el isotipo. Convertirlo en el color de TODA acción: botones, precios, badges "nuevo", la tilde del logo. Un solo acento, siempre el mismo.

### Textura sutil de fondo
Un pattern SVG de puntos o líneas diagonales sutiles en el header y secciones destacadas. Esto agrega profundidad sin necesitar fotos.

```css
.brand-texture {
  background-image: radial-gradient(circle, rgba(244,234,219,0.06) 1px, transparent 1px);
  background-size: 16px 16px;
}
```

### Fraunces como activo tipográfico
Fraunces es una fuente con personalidad (eje óptico variable, serifas blandas). Pocas marcas de snacks la usan. Subir el peso a 800 en títulos y usar el eje `WONK` si está disponible la hace más expresiva y diferente.

### Separador de sección "almendra"
Un divisor SVG inline entre secciones que repite el motivo del isotipo:

```tsx
<div style={{ textAlign: "center", padding: "24px 0", opacity: 0.2 }}>
  <svg width="28" height="20" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="17" ry="13" stroke="#5A1F1A" strokeWidth="2"
             transform="rotate(-8 20 20)"/>
  </svg>
</div>
```

---

## 4. Cómo Hacer que el Header Se Sienta "Marca Real"

Cambios concretos al `Header.tsx` actual, ordenados por impacto:

1. **Integrar el isotipo** — cambiar el `<a>` plano por `<Logo variant="horizontal" size="sm" inverted />`. Un cambio de 1 línea.
2. **Textura de fondo** — agregar la clase `brand-texture` al header.
3. **Transición al scroll** — cuando el usuario hace scroll, el subtítulo colapsa pero el isotipo + wordmark se mantienen. Ya lo hace parcialmente.
4. **Micro-animación del isotipo** — un `rotate` sutil de 2 grados al hacer hover en el logo. Da vida sin ser molesto.

```css
.logo-link:hover svg { transform: rotate(4deg); transition: transform 0.3s ease; }
```

---

## Recomendación Final

Implementar **ahora** (30 minutos de trabajo):
- Opción D (integrar isotipo que ya existe) + Opción A (peso diferencial)
- Textura sutil en header
- Separador almendra entre secciones

Implementar **después** (requiere iterar):
- Opción B (tilde-almendra) como evolución del isotipo — es la más original pero necesita ajuste fino
- Favicon con la "E" o la tilde
- Pattern de puntos como firma visual en packaging y bolsas
