"use client";

interface Props {
  onOrderOpen: () => void;
}

export default function CierreCTA({ onOrderOpen }: Props) {
  return (
    <section
      aria-label="Empezar pedido"
      style={{
        background: "#D0551F",
        padding: "5rem 1.25rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(1.75rem, 7vw, 3rem)",
          color: "#F4EADB",
          lineHeight: 1.15,
          marginBottom: "1rem",
        }}
      >
        ¿Te animás?
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          color: "rgba(244,234,219,0.82)",
          lineHeight: 1.65,
          marginBottom: "2rem",
          maxWidth: 400,
          margin: "0 auto 2rem",
        }}
      >
        Elegí lo que querés, armá tu pedido y te lo llevamos martes a sábado a donde nos digás.
      </p>

      <button
        onClick={onOrderOpen}
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: "1.0625rem",
          color: "#D0551F",
          background: "#F4EADB",
          border: "none",
          borderRadius: "12px",
          padding: "1.125rem 2rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 6px 24px rgba(18,5,3,0.25)",
          WebkitTapHighlightColor: "transparent",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(18,5,3,0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(18,5,3,0.25)"; }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Pedir por WhatsApp
      </button>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "rgba(244,234,219,0.60)",
          marginTop: "1rem",
        }}
      >
        Despachamos a Santa Cruz, Peralillo, Palmilla y Nancagua.
      </p>
    </section>
  );
}
