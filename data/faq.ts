// Fuente única de FAQs. Consumidores:
// - components/FAQ.tsx — renderiza `faqs` completo (usado en /faq).
// - components/PageShell.tsx — renderiza `topFaqs` (5 items con aShort).
// - app/faq/page.tsx — genera JSON-LD FAQPage desde `faqs` completo.

export type FAQItem = {
  q: string;
  /** Respuesta completa (detalle de /faq + JSON-LD FAQPage). */
  a: string;
  /** Versión condensada para el home. Si se omite, el home usa `a`. */
  aShort?: string;
};

export const faqs: FAQItem[] = [
  {
    q: "¿Cómo hago mi pedido?",
    a: 'Elige los productos en el catálogo, selecciona la cantidad y toca "Agregar al pedido". Cuando estés listo, toca "Confirmar por WhatsApp". Se abre un mensaje con todo tu pedido listo para enviar. Confirmamos por WhatsApp y coordinamos la entrega.',
    aShort:
      'Elige los productos, toca "Agregar" y confirma por WhatsApp. Te respondemos y coordinamos la entrega.',
  },
  {
    q: "¿A qué comunas despachan?",
    a: "Despachamos en Marchigüe, Peralillo, Santa Cruz y Cunaco. Si vives en otra zona, escríbenos por WhatsApp y lo evaluamos juntos.",
    aShort: "Marchigüe, Peralillo, Santa Cruz y Cunaco.",
  },
  {
    q: "¿Cuánto cuesta el envío?",
    a: "Envío gratis en compras sobre $25.000. Bajo ese monto: $2.000 (Santa Cruz) o $3.000 (comunas cercanas).",
  },
  {
    q: "¿Cuándo despachan?",
    a: "De martes a sábado, entre 19:30 y 21:00 hrs. Coordinamos por WhatsApp después de confirmar el pedido.",
    aShort: "De martes a sábado, entre 19:30 y 21:00. Coordinamos por WhatsApp.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Transferencia bancaria o efectivo contra entrega. No cobramos online. Al confirmar el pedido te pasamos los datos bancarios por WhatsApp.",
    aShort: "Transferencia bancaria o efectivo contra entrega.",
  },
  {
    q: "¿Cuál es el mínimo de compra?",
    a: "El mínimo por producto es 1 kg. Puedes combinar varios productos para armar el pedido que quieras.",
    aShort: "1 kg por producto. Puedes combinar varios.",
  },
  {
    q: "¿Puedo agregar más productos después de enviar el pedido?",
    a: "Sí, siempre que no hayamos salido a despachar. Escríbenos por WhatsApp y lo sumamos al pedido.",
  },
  {
    q: "¿Cuánto duran los productos?",
    a: "Los frutos secos duran 2–3 meses en frasco hermético en lugar fresco y seco. Los dulces y confites duran hasta 6 meses en las mismas condiciones.",
  },
  {
    q: "¿Tengo derecho a retracto?",
    a: "Sí. Por Ley 19.496 tienes 10 días hábiles desde la recepción para retractarte. Escríbenos por WhatsApp y coordinamos la devolución del producto (sin abrir) y la restitución del pago.",
  },
];

/** Las primeras 5 con su versión condensada para el home. */
export const topFaqs = faqs.slice(0, 5).map((f) => ({
  q: f.q,
  a: f.aShort ?? f.a,
}));
