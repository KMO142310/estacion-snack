# Claude Code Handoff

## Objetivo real del proyecto
Rediseñar `Estación Snack` como una tienda de frutos secos y dulces por kilo que venda mejor, se vea deseable y se sienta confiable sin caer en estética genérica de IA ni en una metáfora ferroviaria forzada.

El foco no es "explicar la app". El foco es:

1. Mostrar producto rápido.
2. Hacer fácil agregar al pedido.
3. Cerrar por WhatsApp con confianza.
4. Dejar una experiencia visual limpia, sobria y comercial.

## No negociables del dueño

### Sí
- Diseño con nivel alto, producto primero.
- UX/UI más editorial y comercial, menos bloques de landing genérica.
- WhatsApp como cierre real del flujo.
- Packs y mezclas visibles temprano.
- Compra simple para gente no técnica.
- Dominio/producto pensado para Chile, Santa Cruz y alrededores.

### No
- No cookies.
- No analytics ni métricas por ahora.
- No copy excesivo.
- No metáforas de tren, estación, andén, ramal, pasajero, boleto, km 35,5, etc.
- No look "web de IA genérica".
- No empujar demasiada pantalla de branding antes del catálogo.

## Estado actual
Ya se hicieron limpiezas importantes:

- Se eliminaron varias referencias explícitas a tren/estación en componentes visibles.
- Se simplificó la franja superior.
- Se removió la "nota"/ocasión de cards de producto y detalle.
- `sobre-nosotros` ya no cuenta la historia ferroviaria.
- Se empezó un rediseño nuevo de:
  - `components/Hero.tsx`
  - `components/Benefits.tsx`
  - `components/ComoFunciona.tsx`
  - `components/PageShell.tsx`
  - `components/ProductCard.tsx`
  - `components/PackCard.tsx`
  - `components/TicketProgress.tsx`

## Atención: trabajo en progreso
La home estaba siendo rearmada cuando se pidió dejar esta pauta.

Eso significa:

- Hay cambios nuevos hechos en hero/home/cards.
- Hay que revisar que `components/PageShell.tsx` haya quedado coherente y sin restos duplicados.
- Antes de deploy hay que correr build otra vez.

No asumir que el estado actual ya está listo para producción sin validar.

## Dirección visual correcta

### Qué hacer
- Usar una estética de alimento bien editado:
  - producto grande
  - tipografía con carácter
  - fondos cálidos y limpios
  - pocos acentos
  - menos cajas, menos ruido
- Tratar la home como una vitrina:
  - best sellers
  - packs
  - categorías
  - cómo comprar
  - dudas cortas
  - cierre a WhatsApp
- Hacer que la primera pantalla muestre producto real, no solo marca.
- Reducir texto por bloque.
- Priorizar ritmo visual y jerarquía.

### Qué evitar
- Tres tarjetas genéricas explicando todo.
- Metáforas decorativas sin aportar venta.
- Hero gigante sin producto visible.
- FAQ enorme en mitad del flujo.
- Copy poético en exceso.
- Repetición del mismo catálogo varias veces.

## Estrategia comercial recomendada
Si este fuera mi negocio, vendería así:

1. Home abre con propuesta breve + producto fuerte.
2. Mostrar "lo más pedido" primero.
3. Ofrecer packs como shortcut de compra.
4. Separar catálogo en dos familias:
   - frutos secos
   - dulces
5. Mostrar señales de confianza mínimas pero concretas:
   - desde 1 kg
   - despacho local
   - pago al recibir / transferencia
   - atención humana por WhatsApp
6. Cerrar con CTA claro, no gritón.

## Archivos clave a revisar primero

- `components/PageShell.tsx`
- `components/Hero.tsx`
- `components/ProductCard.tsx`
- `components/PackCard.tsx`
- `components/Benefits.tsx`
- `components/ComoFunciona.tsx`
- `components/TicketProgress.tsx`
- `app/producto/[slug]/ProductDetail.tsx`
- `app/sobre-nosotros/page.tsx`

## Prioridad exacta de continuación

### 1. Dejar estable la home
- Revisar que `PageShell` no tenga secciones duplicadas.
- Confirmar que la secuencia final sea:
  - hero
  - selección
  - señales de confianza
  - packs
  - frutos secos
  - dulces
  - cómo comprar
  - dudas comunes
  - cierre

### 2. Afinar cards
- Producto:
  - menos texto
  - badge limpio
  - precio muy visible
  - stock solo si aporta
- Pack:
  - que se vea más deseable y menos "tarjeta de info"

### 3. Afinar responsive mobile
- Confirmar que en mobile el primer scroll ya muestre producto.
- Evitar demasiada altura en hero.
- Revisar densidad de cards y espacios.

### 4. Verificar detalle de producto
- Mantener consistencia con la home.
- Sin guiños ferroviarios.
- Info de despacho simple y útil.

### 5. Deploy
- Solo después de validar build y revisión visual.

## Comandos de validación

Desde la raíz del proyecto:

```bash
npx tsc --noEmit
npm run build
npm run start -- --port 3015
```

Luego revisar localmente en mobile.

Si hace falta screenshot:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --virtual-time-budget=3000 --window-size=390,844 --screenshot=/tmp/estacionsnack-home-mobile.png http://127.0.0.1:3015
```

## Deploy

Comando usado en producción:

```bash
vercel deploy --prod -y --force -b NEXT_PUBLIC_SITE_URL=https://www.estacionsnack.cl
```

## Dominio
Hoy el dominio público que sí responde es:

- `https://www.estacionsnack.cl`

Los dominios en plural pueden estar configurados en Vercel pero seguir sin resolver por DNS público. Verificar siempre con `curl -I` antes de afirmar que están funcionando.

## Criterio final de calidad
Antes de cerrar, preguntarse esto:

1. ¿Parece una tienda que vende bien o una landing que explica demasiado?
2. ¿El producto aparece rápido?
3. ¿Hay algo que siga sonando a tren/estación?
4. ¿Hay bloques que podrían borrarse sin perder nada?
5. ¿La experiencia móvil se siente rica y simple?

Si la respuesta no es claramente buena, seguir editando.
