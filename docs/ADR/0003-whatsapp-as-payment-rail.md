# ADR 0003 — WhatsApp como carril de pago explícito

**Fecha:** 2026-04-24
**Estado:** Aceptado
**Revisión prevista:** cuando volumen mensual supere 200 pedidos o cuando el operador ya no pueda confirmar a mano en ventana de 2h.

## Contexto

Estación Snack cierra sus pedidos por WhatsApp: el cliente arma el carrito en el sitio, confirma, el sitio abre un deep-link `wa.me` con el detalle pre-armado, y el cliente envía ese mensaje al operador. El pago ocurre después: transferencia bancaria o efectivo al recibir.

La decisión obvia desde un lens de "producto moderno de e-commerce" sería integrar una pasarela de pago en el checkout. Eso **no se hizo deliberadamente**. Este ADR documenta por qué, para no olvidar el razonamiento cuando la tentación reaparezca.

## Opciones evaluadas

### A — Mercado Pago Checkout Pro

- **Friction UX**: checkout dentro del sitio, redirect a MP para pago, callback con status.
- **Costo**: 3.99% + IVA por transacción (Chile, 2026).
- **Setup**: requiere cuenta empresa MP, credenciales OAuth, webhook idempotente, reconciliación.
- **Compliance**: MP es responsable del compliance PCI; Ley 19.496 Art. 1 y 37 aplican de todas formas.
- **Técnico**: webhook debe manejar retries, idempotency-key, status transitions (pending → approved → chargeback). ~400 líneas de código nuevo + monitoreo.

### B — Stripe (vía Merchant of Record como Paddle o Lemon Squeezy)

- Descartado rápido: Stripe no opera directamente con comercios Chile sin intermediario. Lemon/Paddle agregan 5-8% + spread cambiario. Overkill para CLP local.

### C — Transbank Webpay Plus

- Estándar de facto en Chile. **Requiere afiliación con RUT comercial formal**.
- Negocio actualmente opera como venta directa sin RUT empresa (persona natural). Afiliarse implica constituir empresa, gastos contables recurrentes, IVA.

### D — Flow / Khipu (pasarelas locales)

- Comisiones 2.5-3.5%. Setup similar a MP. Mismo problema de RUT empresa en Flow; Khipu permite transferencia sin convenio pero con UX peor que WhatsApp.

### E — WhatsApp como carril explícito + transferencia manual (decisión actual)

- **Friction UX**: cliente hace clic en CTA → se abre WhatsApp con mensaje pre-armado → envía. El operador recibe, confirma en persona, envía datos bancarios o coordina entrega.
- **Costo**: $0 fijo, $0 por transacción. Solo costo de tiempo humano (~2-3 min por confirmación).
- **Setup**: cero. WhatsApp Business ya instalado.
- **Compliance**: Ley 19.496 Art. 1 y 37 se cumplen mostrando precio total (incl. envío) antes del cierre — eso ya lo hace el OrderSheet del sitio. No hay "pago online" que requiera PSP compliance.
- **Técnico**: [`lib/whatsapp.ts`](../../lib/whatsapp.ts) construye URL con encoding correcto de tildes/Ñ/emojis. Pruebas unitarias cubren casos borde. ~60 líneas totales.

## Decisión

**E.** WhatsApp como carril explícito, documentado como **feature del producto**, no como limitación.

### Razones concretas

1. **El negocio no tiene RUT empresa formal.** Afiliarse a Transbank o declarar operación commercial formal implica gasto recurrente, IVA y overhead contable que el margen actual no soporta. Hasta que el volumen justifique formalización, cualquier pasarela es prematura.

2. **La confirmación humana es parte del servicio.** El cliente medio de Estación Snack (Santa Cruz, mercado local, compra recurrente) valora hablar con una persona. Quitar esa fricción eliminaría una ventaja competitiva, no un defecto. Amazon no puede hacer esto; Estación sí.

3. **Costo marginal de cada pedido**: 2-3 min de tiempo del operador. Comparado con MP 3.99% sobre ticket promedio ~$15.000 CLP = ~$600 CLP ahorrados por pedido. Con 50 pedidos/mes: $30.000 CLP netos recuperados por asumir ese trabajo manual.

4. **WhatsApp es el canal donde el cliente ya está.** Forzarlo a un checkout con redirect + OTP de tarjeta + regreso al sitio reduciría conversión mobile (Baymard Institute 2025: 69.99% cart abandon rate con checkout multi-step).

5. **Cumplimiento Ley 19.496 ya resuelto.** El sitio muestra precio total, subtotal, costo de envío por comuna, identidad del vendedor (RUT natural), política de cambios — todo antes del cierre. El pago online no agrega compliance; agrega riesgo.

6. **Fallback cero**: si Supabase se cae, el sitio sigue mostrando catálogo (fallback estático `data/products.json`) y el link a WhatsApp sigue funcionando. El dueño puede vender sin stack funcionando. Con pasarela, un webhook roto = pedido perdido.

### Qué se acepta perder

- **Pago instantáneo.** El pedido queda `pending_whatsapp` hasta que el operador lo confirma. Ventana típica: <2h en horario laboral. El cliente lo sabe porque el sitio lo dice explícito.
- **Captura automática de datos de pago.** La reconciliación es manual contra extracto bancario. Con <100 pedidos/mes es trivial; si el volumen crece, esto se convierte en el bottleneck.
- **Escala > ventana de atención humana.** Si llegan 30 pedidos en 1h, el operador no puede confirmar todos a tiempo. A ese volumen, la decisión se revierte.

## Consecuencias

### Positivas

- Stack 100% funcional sin proveedor de pago externo. Cero contratos, cero compliance adicional, cero reconciliación automática que mantener.
- UX específica al contexto: venta de barrio con trato personal, no e-commerce genérico. Diferenciador.
- Margen sobre cada pedido recupera tiempo operativo (3.99% no se paga).

### Negativas / riesgos

- **Techo de escala operacional** ~200 pedidos/mes con el operador actual.
- **Carrito abandonado post-WhatsApp**: si el cliente no envía el mensaje, el pedido queda `pending_whatsapp` eterno. Mitigación: cron releasing stock reservations + panel admin que muestra esos pedidos para seguimiento.
- **Dependencia de WhatsApp**: si Meta bloquea `wa.me` o cambia URL scheme, CTA principal se rompe. Mitigación: fallback copy-to-clipboard + Instagram DM (testeable, no implementado).
- **Sin recovery automático si el operador enferma**: no hay backup humano para confirmaciones. Mitigación: delegar temporalmente cambiando `ADMIN_EMAIL` + instrucción en `RUNBOOK.md`.

## Criterios de revisión

Este ADR se revierte cuando **al menos uno**:

- Volumen supera 200 pedidos/mes durante 3 meses consecutivos.
- El operador recibe queja frecuente (> 5% pedidos) sobre latencia de confirmación.
- La venta se formaliza con RUT empresa por razones contables.
- Aparece pasarela chilena sin costo fijo ni RUT empresa exigido, con commission < 1%.

Revisión próxima: **octubre 2026** (6 meses), o antes si se dispara alguno de los triggers.

## Referencias

- Ley 19.496 (Chile) — Protección de los derechos de los consumidores, Art. 1, 16 B, 37.
- Baymard Institute — Cart Abandonment Stats (2025).
- Mercado Pago Chile — Comisiones y requisitos (abril 2026).
- Transbank Webpay Plus — Requisitos de afiliación (abril 2026).
- Estación Snack — [`docs/RUNBOOK.md`](../RUNBOOK.md) (flujo de confirmación manual).
