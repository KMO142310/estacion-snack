"use client";

// PENDIENTE_USUARIO: Reemplazar el SVG placeholder por fotografía editorial real.
// Dirección fotográfica: ver DIRECCION-CREATIVA.md §2.6
// Especificación técnica: foto lateral/tres cuartos, luz dura de mañana,
// superficie madera vieja, frutos secos derramados, mano humana en encuadre.
// Formato: /img/hero.webp + /img/hero.jpg, mínimo 1440×960px.

interface HeroProps {
  onOrderOpen: () => void;
}

export default function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section
      aria-label="Inicio"
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Fondo limpio — sin ilustración vectorial. Tipografía dominante hasta que haya foto real (§DIRECCION-CREATIVA 2.6). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#5A1F1A",
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 25% 15%, rgba(232,160,64,0.10) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 70% 90%, rgba(18,5,3,0.75) 0%, transparent 65%)",
        }}
      />

      {/* Contenido */}
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: "0 1.5rem 2.5rem",
        paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))",
      }}>
        <p style={{
          fontFamily: "var(--font-body)",
          color: "rgba(244,234,219,0.62)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.875rem",
        }}>
          Santa Cruz · Valle de Colchagua
        </p>

        <h1 style={{
          fontFamily: "var(--font-display)",
          color: "#F4EADB",
          fontWeight: 600,
          fontSize: "clamp(2.75rem, 12vw, 5rem)",
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
          marginBottom: "1rem",
          textShadow: "0 2px 24px rgba(0,0,0,0.35)",
        }}>
          Frutos secos del valle,<br />sin la bolsa de más.
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          color: "rgba(244,234,219,0.82)",
          fontSize: "1rem",
          lineHeight: 1.55,
          marginBottom: "2rem",
        }}>
          Pesados al momento en Santa Cruz.<br />
          Despacho martes a sábado en el valle.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <button
            onClick={onOrderOpen}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#F4EADB",
              background: "#D0551F",
              border: "none",
              borderRadius: "10px",
              padding: "1rem 1.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 6px 24px rgba(208,85,31,0.42)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp
          </button>

          <a
            href="#productos"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.78)",
              textAlign: "center",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationColor: "rgba(244,234,219,0.32)",
              padding: "0.5rem",
            }}
          >
            Ver las mezclas
          </a>
        </div>
      </div>
    </section>
  );
}
