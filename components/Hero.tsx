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
      <svg
        viewBox="0 0 390 780"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="hero-bg" cx="55%" cy="65%" r="85%">
            <stop offset="0%" stopColor="#4A1610" />
            <stop offset="100%" stopColor="#180806" />
          </radialGradient>
          <linearGradient id="hero-text-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="rgba(18,5,3,0.55)" />
            <stop offset="100%" stopColor="rgba(18,5,3,0.93)" />
          </linearGradient>
          <radialGradient id="hero-light" cx="8%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#E8A04022" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="390" height="780" fill="url(#hero-bg)" />
        {/* Nuez grande — centro derecha */}
        <g transform="translate(235, 270) rotate(14)">
          <ellipse rx="68" ry="54" fill="#B87840" opacity="0.72" />
          <ellipse rx="60" ry="47" fill="#9E6428" opacity="0.65" />
          <ellipse rx="26" ry="22" transform="translate(-14, 2)" fill="#7A4E20" opacity="0.8" />
          <ellipse rx="24" ry="20" transform="translate(14, 0)" fill="#6A3E18" opacity="0.75" />
          <path d="M0,-54 Q4,-28 0,0 Q-4,28 0,54" stroke="#5A2E10" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M-40,-10 Q-20,-22 0,-8 Q20,6 40,-4" stroke="#8B5A28" strokeWidth="1.5" fill="none" opacity="0.45" />
        </g>
        {/* Almendra izquierda */}
        <g transform="translate(92, 310) rotate(-22)">
          <ellipse rx="20" ry="38" fill="#C49050" opacity="0.68" />
          <ellipse rx="15" ry="32" fill="#A87838" opacity="0.55" />
          <path d="M0,-36 Q2,-15 0,36" stroke="#8A5E28" strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
        {/* Almendra derecha baja */}
        <g transform="translate(320, 410) rotate(8)">
          <ellipse rx="17" ry="30" fill="#B88040" opacity="0.55" />
          <ellipse rx="12" ry="24" fill="#9A6830" opacity="0.45" />
        </g>
        {/* Avellana izquierda baja */}
        <g transform="translate(58, 480) rotate(0)">
          <ellipse rx="24" ry="22" fill="#C89050" opacity="0.5" />
          <ellipse rx="18" ry="16" fill="#A87838" opacity="0.42" />
        </g>
        {/* Maní arriba izquierda */}
        <g transform="translate(145, 175) rotate(-10)">
          <ellipse rx="14" ry="10" transform="translate(-10, 0)" fill="#D4A868" opacity="0.55" />
          <ellipse rx="14" ry="10" transform="translate(10, 0)" fill="#C4986A" opacity="0.5" />
          <rect x="-3" y="-6" width="6" height="12" rx="3" fill="#B88848" opacity="0.4" />
        </g>
        {/* Pasas */}
        <circle cx="165" cy="435" r="10" fill="#4A2018" opacity="0.65" />
        <circle cx="180" cy="450" r="8" fill="#3E1812" opacity="0.6" />
        <circle cx="150" cy="452" r="7" fill="#5A2820" opacity="0.55" />
        <circle cx="190" cy="438" r="6" fill="#3A1410" opacity="0.5" />
        <circle cx="158" cy="466" r="5" fill="#4E2016" opacity="0.45" />
        {/* Nuez pequeña arriba derecha */}
        <g transform="translate(310, 195) rotate(-5)">
          <ellipse rx="30" ry="25" fill="#B87838" opacity="0.48" />
          <ellipse rx="24" ry="19" fill="#9A6228" opacity="0.4" />
          <path d="M0,-24 Q2,-10 0,24" stroke="#7A4818" strokeWidth="1.5" fill="none" opacity="0.38" />
        </g>
        <rect width="390" height="780" fill="url(#hero-light)" />
        <rect width="390" height="780" fill="url(#hero-text-fade)" />
      </svg>

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
          fontSize: "clamp(2.4rem, 10vw, 4.5rem)",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          marginBottom: "1rem",
          textShadow: "0 2px 24px rgba(0,0,0,0.35)",
        }}>
          Tu snack favorito,<br />sin la bolsa de más.
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          color: "rgba(244,234,219,0.82)",
          fontSize: "1rem",
          lineHeight: 1.55,
          marginBottom: "2rem",
        }}>
          Mezclas pesadas al momento en Santa Cruz.<br />
          Llegan martes y viernes.
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
