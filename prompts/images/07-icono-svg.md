# 07 · Icono SVG / Logo

**Output filename**: `public/img/logo-icon.svg` (reemplaza el actual)
**Bonus**: `public/favicon.svg` (mismo diseño, optimizado para 16×16)

## Contexto

Necesitamos un icono que funcione como:
- Logo del header (40-48px)
- Favicon (16×16)
- App icon (Apple touch 180×180)
- OG image accent

Debe verse coherente con el estilo retail-clean recién aplicado:
fondo off-white #FAF9F7, negro #000, accent terracotta #B94A1F, accent
amarillo #EFD200.

## OPCIÓN A — Bolsa sellada (recomendada, va con el manifiesto del negocio)

### Prompt

```
Minimalist single-color SVG icon, 64x64 viewBox, black on transparent
background. A small flat-bottom kraft paper bag with a folded sealed top,
front view, slight 3/4 perspective. Inside the bag, suggested by 3-4 small
circles (frutos secos / nuts) peeking from the top opening. Single weight
1.5px stroke, geometric simplicity, no fill except the nut circles. Style:
Lucide / Phosphor / Heroicons line-icon set. Clean, scalable, works at 16px
favicon size and at 512px hero. NO text, NO color gradients, NO shadows,
NO hand-drawn imperfections — keep mathematically clean.
```

### Negative prompt
```
text, logo type, gradients, shadows, photorealistic, 3D, multiple colors,
cartoon style, brand markings, watermark, complex details
```

---

## OPCIÓN B — Sello postal con almendra

### Prompt

```
Minimalist SVG icon, 64x64 viewBox, black on transparent. A perforated
postal stamp shape (rectangle with scalloped edges like classic postage
stamps) framing a single almond silhouette in the center. Single weight
1.5px stroke for the stamp border, solid fill for the almond. Reference:
Heroicons / Tabler icon style. Geometric, balanced, scales perfectly at
16px and 512px. NO text, NO gradients, NO 3D effects.
```

---

## OPCIÓN C — Bowl con frutos

### Prompt

```
Minimalist SVG icon, 64x64 viewBox, black on transparent. Front view of
a small ceramic bowl, ellipse-shape rim, U-shape body, with 3 spheres
(nuts) stacked above representing the contents. 1.5px stroke weight,
no fills except optional fills on the spheres. Style: Phosphor Icons.
Clean, geometric, works at 16px. NO text, NO color, NO shading.
```

---

## OPCIÓN D — Iniciales monograma "ES"

### Prompt

```
Minimalist SVG monogram of the letters "E" and "S" stacked or
overlapping, 64x64 viewBox. Letters in a clean geometric sans-serif
(reference: Inter Tight, Söhne, Neue Haas Grotesk). Black on transparent.
The monogram should feel like a luxury brand mark — minimal, confident.
Optional: a small dot or accent circle to one side. NO serifs,
NO ornamentation, NO gradients.
```

---

## Cómo elegir

- **A** funciona mejor si querés que el icono LITERALMENTE comunique
  "bolsa sellada de frutos secos". Es lo más narrativo.
- **B** es el más distintivo — el sello postal vincula a "envío local" y
  el almond es producto literal.
- **C** es el más friendly / amable — bowl es universal.
- **D** es el más Apple-tier — abstracto, monograma puro.

Mi recomendación: **A o B**. Coherente con la copy del sitio
("bolsa sellada · cantidad honesta") y suficiente carácter para no
ser otro icono genérico de e-commerce.

## Después de generar

1. Dropear el SVG generado en `public/img/logo-icon.svg`.
2. Si el generador entrega PNG, convertir a SVG con [SVGOMG](https://jakearchibald.github.io/svgomg/) o [Recraft](https://www.recraft.ai/) (modo vector).
3. Actualizar `<Image src="/img/logo-icon.svg" />` en Header — ya apunta
   ahí, no hace falta tocar código.
4. Para favicon, exportar a `public/favicon.svg` adicional. Next.js lo
   serve automático.
