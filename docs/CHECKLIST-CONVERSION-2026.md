# Checklist de conversion para estacionsnack.cl
## Basado en patrones reales de marcas DTC exitosas (abril 2026)

Fuentes analizadas: Graza.co, Pipsnacks/Pipcorn, Olipop, Monti Verdi, Linz Shop.
Datos de: Baymard Institute, Justuno, ConvertCart, Johns Hopkins (UX food psychology).

---

### HERO / ABOVE THE FOLD (mobile)

- [HACER] Agregar foto editorial real como fondo del hero. Graza y Olipop lideran con foto lifestyle, no color plano. El fondo #5A1F1A sin foto transmite "sitio en construccion". Johns Hopkins: las imagenes de comida activan centros de recompensa del cerebro y disparan antojos.
- [HACER] Mostrar 1-2 productos estrella visibles sin scroll. Pipsnacks muestra productos inmediatamente. Hoy el hero ocupa 100svh y los productos no se ven hasta hacer scroll completo.
- [HACER] CTA principal debe decir que HACER, no a donde ir. Cambiar "Pedir por WhatsApp" del hero por algo como "Armar mi pedido" o "Ver mezclas". El WhatsApp es el MEDIO, no la accion. Graza: "SHOP NOW". Olipop: "Shop [sabor]".
- [NO HACER] No usar hero de pantalla completa (100svh) en mobile. El usuario no sabe que hay productos abajo. Baymard: 76% de usuarios juzgan si un sitio es relevante en los primeros 2-3 segundos. Si ven solo texto y color, rebotan.
- [EVALUAR] Eliminar el hero o reducirlo a 40-50vh maximo, mostrando las cards de producto parcialmente visibles debajo para invitar al scroll.

### GRILLA DE PRODUCTOS

- [HACER] Fotos de producto mas grandes y de mejor calidad. 47% de los consumidores dice que las fotos son el factor #1 para decidir comprar (Baymard/Justuno). Las fotos actuales son 1:1 en cards de 2 columnas — ok ratio, pero necesitan ser profesionales, no stock.
- [HACER] Agregar variante de peso al boton. "Agregar 1 kg" esta bien, pero agregar opcion de 500g o medio kilo reduciria barrera de entrada. Pipsnacks usa un "bundle creator" que sube el ticket promedio.
- [HACER] Mostrar precio por unidad mas prominente: font-size 16-18px bold segun mejores practicas de card UI (FoxEcom, Eleken). Hoy esta en 14px que es chico en mobile.
- [HACER] Badge de "Ultimo kg" es un patron de urgencia que FUNCIONA. Mantenerlo. FOMO es el #1 motivador psicologico en compra de comida online.
- [EVALUAR] Agregar un badge "Mas vendido" o "Favorito" al producto top. Frases como "favorito" o "popular" aumentan clicks segun estudios de menu psychology (ChowNow).
- [NO HACER] No agregar mas de 2 badges por producto. Demasiados badges = ruido visual.

### TRUST / CONFIANZA (secciones intermedias)

- [HACER] Integrar TrustBar ANTES de los productos, no despues. Graza, Olipop, Linz Shop: todos muestran propuesta de valor (envio, calidad, metodo) ARRIBA del catalogo. Ya tenes el componente TrustBar.tsx — solo hay que moverlo.
- [HACER] Activar Testimonials.tsx o PruebaSocial.tsx en PageShell. Hoy NO se renderizan. Productos con 11-30 reviews convierten 68% mas que los de 0 reviews (Baymard). Incluso 2-3 testimonios ya suman.
- [HACER] Agregar el componente ComoFunciona.tsx a PageShell. El flujo "3 pasos" reduce ansiedad de compra. Graza tiene flujo visual de uso; Olipop explica beneficios antes de pedir comprar.
- [HACER] Los mensajes estilo WhatsApp de PruebaSocial.tsx son oro puro para una marca local. Activarlos ya. Es prueba social contextualizada — mas creible que estrellas genericas.
- [EVALUAR] Agregar numero real de entregas del metrics.json como social proof visible. "87+ entregas en el valle" pesa mas que cualquier frase de marketing.

### PRECIO Y VALOR PERCIBIDO

- [HACER] Mostrar el precio por 100g como referencia comparativa. "$X.XXX/kg" suena caro en abstracto. "$X90/100g" se compara mentalmente con el super y gana. La psicologia de precios dice: dar contexto de comparacion reduce la friccion.
- [EVALUAR] Agregar "precio de referencia" tachado si el supermercado cobra mas por el mismo producto en envase chico. Graza no lo hace (posicion premium), pero para un mercado sensible a precio como Santa Cruz, esto convierte.
- [NO HACER] No esconder el precio. Ya lo muestras bien — mantenerlo visible en la card sin necesidad de hacer click.
- [EVALUAR] Pack section: mostrar ahorro explicito ("Ahorrás $X vs. comprar por separado"). Pipsnacks empuja bundles con free shipping threshold — mismo principio.

### CTA Y FLUJO DE COMPRA

- [HACER] Sticky bar inferior: cambiar "Ver pedido" por "Confirmar pedido (N productos)". El CTA actual es pasivo. ConvertCart: CTAs orientados a accion aumentan conversion 15-20%.
- [HACER] Verificar que el flujo completo sean maximo 3 taps: agregar producto → ver pedido → confirmar por WhatsApp. Graza: 2-3 clicks a checkout. Cada paso extra pierde ~20% de usuarios.
- [HACER] El boton "Ver mi pedido" del CTA final deberia ser "Pedir por WhatsApp" con el icono. Es el paso final — tiene que ser el boton mas fuerte de la pagina.
- [NO HACER] No usar "Queres probar?" como CTA. Es una pregunta retorica, no una invitacion a actuar. Reemplazar por algo directo: "Arma tu pedido en 2 minutos" o lo que ya tiene CierreCTA.tsx ("Te animas?") que es mejor.
- [HACER] Activar CierreCTA.tsx en lugar del CTA inline actual de PageShell. Es mas completo, tiene WhatsApp icon, y comunica zona de despacho.

### MOBILE FIRST

- [HACER] Sticky add-to-cart en product sheet. Cuando el usuario abre el detalle de un producto y hace scroll, el boton de agregar debe seguir visible. Un brand de plant-based food aumento conversiones 4% solo con esto (ConvertCart/The Good).
- [HACER] Boton de agregar debe tener minimo 48px de alto para tap targets en mobile. Hoy tiene padding: 8px 0 con font 12px — es chico. Google recomienda 48x48px minimo.
- [NO HACER] No ocultar la sticky bar en desktop (hoy se oculta con @media min-width 768px). En desktop deberia convertirse en un mini-cart persistente en el header.
- [EVALUAR] Agregar haptic feedback mas notorio al agregar producto (ya existe hapticSuccess pero verificar que funciona en todos los dispositivos).

### FOTOS Y CONTENIDO VISUAL

- [HACER] Prioridad #1: fotografias reales. Es el cambio con mayor impacto posible. Graza tiene fotos "inesperadas" (aceite sobre helado). Monti Verdi tiene foto del campo arriba. Sin foto real, todo lo demas es optimizar los muebles de un departamento sin pintar.
- [HACER] Foto del equipo/local para DetrasDe.tsx. Ya esta el placeholder. Las marcas DTC exitosas muestran las personas detras. Olipop cuenta su historia de origen. Graza muestra olivares reales.
- [EVALUAR] Agregar foto de producto en contexto (mesa de once, escritorio de oficina, tabla de picoteo) ademas de la foto de producto suelto. Aumenta deseo segun Johns Hopkins.
- [NO HACER] No usar fotos de stock de frutos secos. Se nota inmediatamente y destruye confianza. Mejor sin foto que con foto falsa.

### ORDEN DE SECCIONES RECOMENDADO (basado en patrones exitosos)

Orden actual: Header → Productos → Packs → FAQ → CTA mini → Footer

[HACER] Orden recomendado basado en Graza + Olipop + Baymard:

```
1. Header (sticky, compacto)
2. Hero reducido (40vh max, foto real, CTA directo)
3. TrustBar (propuesta de valor en 3 puntos)
4. Productos (grilla, el core del sitio)
5. Packs
6. ComoFunciona (3 pasos)
7. PruebaSocial / Testimonials (social proof)
8. DetrasDe (historia de marca)
9. FAQ (solo 4-5 preguntas clave, no 9)
10. CierreCTA (cierre con WhatsApp)
11. Footer
```

### FAQ

- [EVALUAR] Reducir de 9 a 5 preguntas en homepage. Las otras 4 pueden vivir en /faq. Demasiadas preguntas en homepage transmiten "este proceso es complicado". Las 5 clave: como pedir, zonas, costo envio, medios de pago, minimo de compra.
- [HACER] La pregunta "Cuanto duran los productos?" deberia estar en la ficha de producto, no en FAQ general. Es informacion de producto, no duda operativa.

### VELOCIDAD Y PERFORMANCE

- [HACER] Page speed es critico en mobile. Mobile convierte a la mitad que desktop (1.8-2.8% vs 3.2-3.9%). Cada segundo extra de carga pierde clientes. Ya usas Next.js con force-static — bien. Verificar LCP con Lighthouse mobile, target < 2.5s.
- [NO HACER] No agregar framer-motion en componentes que se cargan above the fold. Testimonials.tsx ya usa framer-motion — ok porque esta abajo. Pero no mover eso arriba sin lazy loading.

---

## RESUMEN: Top 5 cambios de mayor impacto (en orden)

1. **Foto real en hero + reducir hero a 40vh** — de lejos el cambio #1. Sin esto, nada mas importa.
2. **Activar TrustBar arriba de productos + PruebaSocial/Testimonials abajo** — componentes que YA EXISTEN y no se renderizan.
3. **Reordenar secciones** segun el flujo probado: valor → productos → prueba social → historia → CTA.
4. **CTAs mas directos** — "Armar mi pedido" > "Queres probar?". Botones mas grandes en mobile (48px minimo).
5. **Precio por 100g** como referencia comparativa — reduce la friccion de "$X.XXX/kg suena caro".

---

Fuentes:
- Graza.co: hero fotografico, precios visibles, CTAs directos, reviews Okendo, Instagram UGC
- Pipsnacks.com: bundle creator, Shopify Plus, navegacion simple, ilustraciones custom
- Olipop (drinkolipop.com): colores vibrantes, tipografia contrastante, storytelling de salud, modelo suscripcion
- Monti Verdi: foto de campo a sangre, paginas de producto con secciones de color
- Linz Shop: navegacion por categorias, fotografia de producto premium
- Baymard Institute: DTC UX benchmark, 5 pitfalls comunes, checkout optimization
- Justuno: 6 estrategias para DTC food & beverage
- ConvertCart: sticky add-to-cart +4% conversion, 31 tacticas DTC
- FoxEcom/Eleken: product card best practices, precio 16-18px bold
- Johns Hopkins: imagenes de comida activan centros de recompensa cerebral
- Dynamic Yield: food & beverage lidera con 6.22% conversion rate
- Mida App: mobile conversion 1.8-2.8% vs desktop 3.2-3.9%
