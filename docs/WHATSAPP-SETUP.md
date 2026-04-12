# WhatsApp Business — Guía de configuración para Estación Snack

Número: +56 9 5374 3338 · App gratuita (no API)

---

## 1. Configuración inicial de WhatsApp Business

1. Descargar **WhatsApp Business** (no WhatsApp normal) desde Play Store / App Store.
2. Registrar con el número +56 9 5374 3338.
3. **Perfil de empresa** (Ajustes > Herramientas para la empresa > Perfil):
   - Nombre: Estación Snack
   - Categoría: Tienda de alimentos
   - Descripción: "Frutos secos frescos por kilo. Despacho mar-sáb en Santa Cruz y comunas cercanas."
   - Dirección: Santa Cruz, O'Higgins
   - Horario: Lunes a sábado, 10:00–20:00
   - Sitio web: estacionsnack.cl
   - Email: (el que uses)

## 2. Mensaje de ausencia (respuesta automática)

Ajustes > Herramientas para la empresa > **Mensaje de ausencia** > Activar.

```
Hola, gracias por escribirnos. Estamos fuera de horario pero te respondemos
mañana a primera hora. Si quieres armar tu pedido mientras tanto, entra a
estacionsnack.cl y te llega todo listo.
```

- Programación: **Fuera del horario comercial** (usa el horario del perfil).
- Destinatarios: **Todos**.

## 3. Mensaje de bienvenida

Ajustes > Herramientas para la empresa > **Mensaje de bienvenida** > Activar.

```
Hola! Soy de Estación Snack. Vendemos frutos secos frescos por kilo
en Santa Cruz y comunas cercanas.

Puedes armar tu pedido en estacionsnack.cl o preguntarme directo por acá.
```

## 4. Respuestas rápidas (atajos de teclado)

Ajustes > Herramientas para la empresa > **Respuestas rápidas** > Añadir.

| Atajo    | Mensaje |
|----------|---------|
| `/precio` | "Los precios están actualizados en estacionsnack.cl. Si necesitas un precio puntual, dime qué producto y te lo paso." |
| `/horario` | "Despachamos de martes a sábado, entre 19:30 y 21:00 hrs. Coordinamos el día exacto al confirmar tu pedido." |
| `/zona` | "Despachamos en Santa Cruz, Peralillo, Palmilla y Nancagua. Si estás en otra zona, cuéntame y vemos." |
| `/pago` | "Aceptamos transferencia bancaria y efectivo contra entrega. Al confirmar te paso los datos." |
| `/confirm` | "Pedido confirmado. Te aviso cuando esté listo para despacho. Gracias!" |
| `/listo` | "Tu pedido está listo y sale hoy. Te escribo cuando esté en camino." |

Para usar: en cualquier chat escribe `/` y el atajo. Máximo 50 respuestas rápidas.

## 5. Catálogo de productos dentro de WhatsApp

Ajustes > Herramientas para la empresa > **Catálogo** > Agregar artículo.

Por cada producto:
- Foto de buena calidad (fondo limpio, luz natural)
- Nombre: "Almendras tostadas" (sin mayúsculas gritadas)
- Precio: por kilo (ej: $8.990/kg)
- Descripción: 1-2 líneas con origen o beneficio
- Link: URL del producto en estacionsnack.cl

Puedes subir hasta 500 productos. Los clientes lo ven tocando el ícono de tienda en tu perfil.

## 6. Etiquetas para seguimiento de pedidos

Ajustes > Herramientas para la empresa > **Etiquetas**. Crear estas 4:

| Color    | Etiqueta       | Cuándo aplicar |
|----------|---------------|----------------|
| Amarillo | Nuevo pedido   | Llega el mensaje del sitio web |
| Azul     | Confirmado     | Confirmas stock + datos de pago enviados |
| Naranja  | Despachado     | Sale el pedido |
| Verde    | Entregado      | Cliente recibió |

Para etiquetar: mantén presionado el chat > ícono de etiqueta > seleccionar. Puedes filtrar por etiqueta desde la pantalla principal.

## 7. Integración con el sitio web (ya implementado parcialmente)

**Lo que ya funciona**: botón "Pedir por WhatsApp" que abre wa.me con mensaje pre-armado (ver `lib/whatsapp.ts`).

**Mejoras posibles sin tocar código**:
- El link wa.me actual ya incluye el detalle del pedido completo con productos, cantidades y total.
- Asegurarse de que el perfil de WhatsApp Business esté verificado (ícono verde) para generar confianza.

**Mejoras con código** (pedir cuando haga falta):
- Widget flotante de WhatsApp en esquina inferior derecha (burbuja verde siempre visible).
- Mensaje de confirmación post-pedido con link a `/pedido/[id]` para seguimiento.

## 8. Automatización futura (cuando crezcas)

Cuando el volumen de pedidos supere lo que puedes manejar manual:

**Opción 1 — n8n (self-hosted, gratis)**
- Requiere WhatsApp Business API (Meta Cloud API, gratis hasta 1.000 conversaciones/mes).
- n8n se instala en Railway (gratis para testing) o VPS desde ~$5/mes.
- Flujo típico: pedido en web > webhook a n8n > mensaje automático de confirmación > notificación al admin.

**Opción 2 — Make.com (sin código)**
- Plan gratis: 1.000 operaciones/mes.
- Conecta WhatsApp Business API + Supabase + notificaciones.
- Más fácil de configurar que n8n, pero más limitado en el free tier.

**Opción 3 — Chatbot simple**
- Plataformas como Whato o Tidio ofrecen bots básicos para WhatsApp.
- Útil para responder preguntas frecuentes 24/7.
- Costo: desde gratis (limitado) hasta ~$15/mes.

**Recomendación**: por ahora, la app gratuita de WhatsApp Business con las respuestas rápidas y etiquetas es suficiente. La automatización vale la pena cuando proceses +20 pedidos/día.

---

*Última actualización: abril 2026*
