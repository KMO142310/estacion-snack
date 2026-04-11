"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Cómo hago mi pedido?",
    a: 'Elige los productos en el catálogo, selecciona la cantidad y tocá "Agregar al pedido". Cuando estés listo, tocá "Confirmar por WhatsApp". Se abre un mensaje con todo tu pedido listo para enviar. Confirmamos por WhatsApp y coordinamos la entrega.',
  },
  {
    q: "¿A qué comunas despachan?",
    a: "Despachamos en Santa Cruz, Peralillo, Palmilla y Nancagua. Si vivís en otra zona, escríbenos por WhatsApp y lo evaluamos juntos.",
  },
  {
    q: "¿Cuánto cuesta el envío?",
    a: "El envío es gratis. Sin mínimo de compra y sin costo de despacho.",
  },
  {
    q: "¿Cuándo despachan?",
    a: "Los martes y viernes. Coordinamos el horario exacto de entrega por WhatsApp después de confirmar el pedido.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Transferencia bancaria o efectivo contra entrega. No cobramos online. Al confirmar el pedido te pasamos los datos bancarios por WhatsApp.",
  },
  {
    q: "¿Cuál es el mínimo de compra?",
    a: "No hay mínimo. Podés pedir desde 500 g de un solo producto (o 250 g en el caso de Chuby Bardú).",
  },
  {
    q: "¿Puedo agregar más productos después de enviar el pedido?",
    a: "Sí, siempre que no hayamos salido a despachar. Escríbenos por WhatsApp y lo sumamos al pedido.",
  },
  {
    q: "¿Cuánto duran los productos?",
    a: "Los frutos secos duran 2–3 meses en frasco hermético en lugar fresco y seco. Los dulces y confites duran hasta 6 meses en las mismas condiciones.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 720 }}>
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            style={{
              background: "#fff",
              border: `1.5px solid ${isOpen ? "#D0551F" : "rgba(90,31,26,0.10)"}`,
              borderRadius: "14px",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                padding: "1.125rem 1.25rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                background: "none",
                border: "none",
                color: "#5A1F1A",
                textAlign: "left",
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 300,
                  color: "#D0551F",
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p
                style={{
                  padding: "0 1.25rem 1.125rem",
                  fontSize: "0.9rem",
                  color: "#7A8457",
                  lineHeight: 1.7,
                  margin: 0,
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
