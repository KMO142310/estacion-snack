# Estación Snack — Guía de Marca

**Versión:** 1.0 · 14-abril-2026
**Última revisión:** post-commit de identidad ferroviaria

Documento de referencia para mantener coherencia de marca en futuras iteraciones. Leer antes de tocar copy, visual o estructura.

---

## 1. El qué: marca en una línea

**Estación Snack** es una marca de frutos secos y dulces por kilo del Valle de Colchagua (Chile), vendida directo por WhatsApp, ambientada como la antigua estación de tren de Santa Cruz — km 35,5 del Ramal San Fernando–Pichilemu.

---

## 2. El por qué: decisiones de posicionamiento validadas

Tres gaps reales de mercado identificados en Research C (abril 2026) que definen la diferenciación:

1. **Territorio**: ningún competidor nacional de frutos secos usa "Valle de Colchagua" como identidad. Está disponible. La industria vinícola vecina ya consolidó Colchagua como "premium" — Estación Snack lo toma prestado por adyacencia.
2. **Formato**: 1 kg es un diferencial contra supermercado (300–700 g). Coloquialismo de anfitrión vs snack industrial.
3. **Cercanía humana**: WhatsApp directo con la dueña, sin apps ni cadenas. No hay competencia B2C pequeña posicionada así en Colchagua.

La identidad ferroviaria se suma como motivo de marca — amplía el territorio sin quitarle peso.

---

## 3. Identidad ferroviaria (commit `ed37c10`, ampliado en commits posteriores)

### Hechos históricos verificables

Fuentes: Museo Ramal San Fernando–Pichilemu, EFE Cultura, Memoria Chilena, Consejo de Monumentos Nacionales.

| Año | Hito |
|-----|------|
| 1870 | Ley que autoriza construcción del Ramal San Fernando–Pichilemu |
| 1909 | La parada "Las Trancas" pasa a ser Estación **Paniahue** |
| 1926 | Inauguración del tramo completo hasta Pichilemu |
| 1934 (29-sep) | Paniahue se rebautiza **Estación Santa Cruz** |
| 1986 (9-mar) | Último tren de pasajeros |
| 1993 | Último servicio de carga |
| 2004 (14-abr) | Vuelve como Tren del Vino |
| 2010 (20-feb) | Último servicio post-terremoto 27/F |

**Datos clave:**
- Ramal: **119,1 km** San Fernando → Pichilemu
- Estación Santa Cruz: **km 35,5**
- Locomotora **N.º 607 tipo 57** (1913): Monumento Nacional
- Estación Colchagua (Palmilla): **Monumento Nacional 1993**
- Túnel El Árbol: 1.960 m

### Reglas estrictas

1. **NUNCA** afirmar que Estación Snack opera en la estación histórica, ni que tiene vínculo con EFE o el Tren del Vino. Disclaimer explícito ya en `/sobre-nosotros`.
2. **NO** usar logos de EFE, marca "Tren del Vino", "Ruta del Vino" ni fotos de la estación real sin licencia.
3. **NO** inventar fechas nostálgicas ("desde 1926..."). La marca es contemporánea.
4. **NO** caer en cliché sepia. Paleta cruda contemporánea, no postal vintage.
5. **NO** atar la identidad a conteo de productos (ver sección 5 abajo).

### Vocabulario permitido (chileno ferroviario estándar)

- **Ramal**, **estación**, **cabecera**, **andén**, **parada**, **apeadero**
- **Km** / **hito kilométrico** (el motivo visual signature es Km 35,5)
- **Despacho**, **boletería**, **bitácora**, **guía del pasajero**
- **Carga**, **carga combinada** (packs), **tender**, **silbato**, **partida**
- **Itinerario**, **horario**

### Vocabulario aplicado a cada sección (estado actual)

| Sección | Label | Title |
|---------|-------|-------|
| Announce bar | — | (tablero de salidas rotativo) |
| Hero | "Santa Cruz · Valle de Colchagua" | "Estación Snack." italic |
| Prólogo productos | "Andén · Las mezclas" | verso editorial |
| Packs | "Carga combinada" | "Si querés probar dos de una..." |
| ComoFunciona | "Itinerario" | "Así llega tu despacho." |
| FAQ | "Guía del pasajero" | "Lo que me suelen preguntar." |
| CTA cierre | "Del andén a tu mesa" | "Cuando quieras, te escribimos." |
| /sobre-nosotros | "Km 35,5 · Bitácora" | "Del andén a tu mesa." + Bitácora del Ramal |

### Tablero de salidas (Announce) — mensajes

Rota cada 7s (respeta `prefers-reduced-motion` + pause on hover):
- "Próxima salida · despacho martes a sábado"
- "Cabeceras · Marchigüe · Peralillo · Santa Cruz · Cunaco"
- "Carga desde 1 kg · pedido por WhatsApp"

Formato: fondo burdeo oscuro (#3d1613), texto crema uppercase letterspaced con luz ámbar parpadeante (#E0A84D) como signal light.

---

## 4. Sistema visual

### Paleta (validada contraste WCAG AA)

| Nombre | Hex | Uso |
|--------|-----|-----|
| Terracota | `#A8411A` | CTAs primarios, acentos, labels importantes |
| Crema | `#F4EADB` | Fondo principal, texto sobre burdeo |
| Burdeo | `#5A1F1A` | Texto principal, fondos dramáticos (footer, hero overlay, cta cierre) |
| Oliva | `#5E6B3E` | Texto secundario, ocasiones italic, acentos calmos |
| Burdeo oscuro | `#3d1613` | Announce board |
| Ámbar signal | `#E0A84D` | Luz parpadeante del Announce (única vez) |

**Contraste verificado:**
- Crema sobre Terracota: **6.57:1** ✓ AA normal
- Crema sobre Burdeo: **9.77:1** ✓ AAA
- Burdeo sobre Crema: **9.77:1** ✓ AAA
- Oliva sobre Crema: **5.03:1** ✓ AA

### Tipografía

- **Fraunces** (serif display, Google Fonts, variable font): headings, nombres de producto, frases destacadas, firmas. Uso preferente en *itálica 500-600*.
- **Inter** (sans body, Google Fonts): texto de cuerpo, labels, UI, precios.
- **tabular-nums** (`font-variant-numeric: tabular-nums`) obligatorio en todo dato numérico: precios, km, fechas, horarios, pesos.

### Jerarquía tipográfica signature

1. Marca monumental: Fraunces italic, clamp(3.5rem, 14vw, 7.5rem), letter-spacing -0.04em
2. Section title: Fraunces italic, clamp(1.5rem, 4vw, 2.5rem)
3. Label uppercase: Inter 700, 11px, letter-spacing 0.14–0.22em, color terracota o subdued
4. Body: Inter 400–500, 15–16px, line-height 1.5–1.7
5. Micro: Inter 500, 11px, line-height 1.4

### Elementos visuales signature

**Hito kilométrico (`components/icons/KmStone.tsx`)**:
- Disco crema con filete interior doble, "KM" arriba (Inter uppercase letter-spaced) y "35,5" abajo (Fraunces italic terracota)
- 64–72px default
- Aparece en: Hero, Footer

**Filete doble (`components/Filete.tsx`)**:
- Dos líneas horizontales con gap de 3px (borde superior + inferior)
- Centrado con ornamento "· · ·" (default), "✺" o sin ornamento
- Separador de secciones; usar con moderación (máx 1-2 por página)

**Sello de despacho** (ProductDetail, info despacho):
- Outline `double` CSS (filete clásico de imprenta) + border solid
- Label uppercase "Itinerario · Km 35,5" en terracota
- Datos en tabular-nums

### Motion

- `MotionConfig reducedMotion="user"` a nivel root (`PageShell.tsx`)
- Auto-rotate Hero: 8s, pause on hover/focus, respeta reduced-motion
- Auto-rotate Announce: 7s, mismo tratamiento
- Scroll-padding-top: 110px (WCAG 2.4.11 — header sticky no tapa focus)

---

## 5. Voz de marca

### Tono

Primera persona, chileno, cálido, honesto, seco. No gourmet. No publicitario. No emojis. No superlativos.

**Sí:**
- "El que se acaba primero en cualquier mesa."
- "Lo que me suelen preguntar."
- "Si querés probar dos de una, ya los armé."
- "Del andén a tu mesa."

**No:**
- "Los mejores frutos secos del mercado" (superlativo)
- "Descubre el sabor único" (publicitario)
- "🌟 Envío express!" (emoji + puntuación exagerada)
- "Seis mezclas curadas por expertos" (pretencioso + count)

### Reglas específicas

1. **Nunca atar identidad a conteo**. No decir "Seis mezclas", "Tres packs", "N.º 01 de 6". La dueña ampliará el catálogo.
2. **Nunca** decir "pesamos al momento" — los productos vienen en bolsas industriales de 1 kg pre-armadas (ver `project_packaging.md` en memoria).
3. **Nunca** usar "kraft" o "artesanal" para describir el packaging — son bolsas industriales semitransparentes con etiqueta.
4. **Siempre** usar ocasiones como hook editorial en productos (como maridaje de vino):
   - Mix Europeo → "El repetido de todos los jueves."
   - Chuby Bardú → "El que se acaba primero en cualquier mesa."
   - Almendra Entera → "La picada seria."
   - Maní Tropical → "El que desaparece antes que los niños."
   - Maní Rojo → "El que pedís una vez y volvés a pedir."
   - Gomita Osito → "El que acompaña el café de las 4."

### Copy no negociable

- Nombre marca: **Estación Snack** (mayúscula inicial en ambas palabras, sin logo wordmark alternativo por ahora)
- Slogan hero: *"Frutos secos y dulces del valle. De los que se acaban antes que la conversación."*
- Frase bitácora: *"Del andén a tu mesa."*

---

## 6. Cobertura operativa (actual)

| Comuna | Tarifa | Tiempo |
|--------|--------|--------|
| Santa Cruz | $2.000 | Mismo día (martes–sábado 19:30–21:00) |
| Marchigüe, Peralillo, Cunaco | $3.000 | Mismo día |
| Otras | Consultar WhatsApp | — |

**Envío gratis** sobre $25.000. **Pago**: transferencia o efectivo contra entrega. **Retracto**: 10 días hábiles (Ley 19.496 Art. 3 bis).

---

## 7. Stack técnico (referencia rápida)

- Next.js 16.2.3 (App Router, Turbopack)
- React 19.2.4
- TypeScript 5
- Tailwind v4 (instalado pero se usa inline styles por ahora)
- Framer Motion 12
- Supabase (Postgres + Auth + Storage con RLS hardened)
- Vercel deploy (www.estacionsnack.cl)
- @vercel/analytics + @vercel/speed-insights activos
- Zod validation en server actions
- focus-trap-react en sheets

**Archivos críticos para mantener coherencia:**
- `components/Hero.tsx` — marca monumental + km stone
- `components/Announce.tsx` — tablero de salidas
- `components/PageShell.tsx` — orquestador + labels editoriales
- `components/ProductCard.tsx` — ocasión + nombre + precio + CTA
- `components/icons/KmStone.tsx` — mark signature
- `components/Filete.tsx` — separador editorial
- `app/sobre-nosotros/page.tsx` — Bitácora del Ramal
- `data/products.json` — ocasiones, stock, precios
- `app/globals.css` — paleta `@theme inline` + scroll-padding

---

## 8. Qué investigar / desarrollar si se quiere seguir

### Oportunidades visuales no exploradas aún

1. **Tipografía monospace** en Announce para feel más "LED board"
2. **Sello circular con fecha** en product detail (timbre real de estación)
3. **Ilustración del ramal** en `/envios` como mapa esquemático de ruta (Santa Cruz → cabeceras)
4. **Timeline vertical visual** en `/sobre-nosotros` en vez de lista (actual es lista simple)
5. **Tren del Vino** como referencia narrativa en `/contacto` (no logo, solo evocación)
6. **Cartela/señalética** de estación como patrón visual para product badges
7. **Boleto perforado** como patrón para páginas legales (dashed border top/bottom)
8. **Número de serie** tipo boleto en cada card — pero sin atar a count (ej: "CARGA N.º 024" random/permanente por producto)

### Oportunidades técnicas pendientes

- Rich results Product (verified in Batch 3, validate con Search Console en vivo)
- Migrar inline styles a Tailwind o CSS modules (deuda técnica)
- Contenido dinámico desde Supabase (productos, packs) en vez de JSON
- Implementar `useOptimistic` en add-to-cart (React 19)
- A/B test: grid 2 col mobile vs 1 col en /producto
- PWA installable (manifest ya OK, falta service worker básico)

### Oportunidades de copy / contenido

- **Cada mezcla con maridaje**: "Mix Europeo · va bien con café de media mañana, libros, sobremesas cortas"
- **Ruta visual en `/envios`**: mapa simple mostrando las 4 comunas con km desde Santa Cruz
- **Testimonios reales de WhatsApp** (con permiso de los clientes) en vez de los ficticios que ya se eliminaron
- **Entrada de blog/notas** como "cuaderno" editorial real (opcional — si la dueña escribe)
- **Descripciones de producto en voz "jefa de estación"**: más personal, más chileno

---

## 9. Memoria persistente (en `~/.claude/projects/`)

Archivos de memoria que siempre debo revisar antes de tocar cosas:

- `MEMORY.md` — índice maestro
- `user_profile.md` — perfil de la dueña (solo yo + IA, sin equipo, Santa Cruz)
- `feedback_base_cientifica.md` — **regla cero**: todo con respaldo investigado, estándar doctoral
- `feedback_design.md` — nada genérico/predecible
- `feedback_ux_cart.md` — carrito debe sentirse
- `feedback_no_count_branding.md` — jamás "6 mezclas" como identidad
- `project_formato_venta.md` — BOLSAS de 1 kg, no pesaje
- `project_packaging.md` — industriales semitransparentes
- `project_no_email_marketing.md` — probablemente sin Resend
- `project_identidad_ferroviaria.md` — este tema, resumido
- `project_estacion_snack.md` — contexto del proyecto

---

## 10. Criterio de "buen trabajo"

Un cambio o nueva feature está bien cuando:

1. **Tiene respaldo**: cita fuente pública verificable, o referencia a un research previo (Baymard, NN/g, WCAG, BCN para legal chileno, Museo Ramal, etc.). Si es decisión estética sin respaldo, marcarla como tal en el commit.
2. **No atado a count**: no depende de que haya 6 productos, 3 packs, etc.
3. **Coherente con la voz**: primera persona chilena, sin superlativos, sin emojis, sin "gourmet".
4. **Funcional primero**: el cambio no rompe el flujo de compra (cart → WhatsApp).
5. **Respeta la paleta y tipografía** actuales (cambiarlas requiere decisión explícita de la dueña).
6. **Accesible**: contraste AA mínimo, tap-target 44px mínimo, keyboard-accesible.
7. **Documentado**: si introduce vocabulario nuevo o estructura nueva, actualizar esta guía.

---

**Si alguna decisión entra en conflicto entre este documento y un feedback directo de la dueña durante la sesión, el feedback directo gana. Después, actualizar este documento.**
