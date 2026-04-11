// PENDIENTE_USUARIO: agregar foto real del equipo/local en /img/equipo.webp
// Especificación: foto horizontal a sangre del fundador o equipo en bodega,
// sin estilizar, delantal usado, pesa, bolsas de kraft al fondo.

export default function DetrasDe() {
  return (
    <section
      aria-label="Detrás de Estación Snack"
      style={{ background: "#5A1F1A", padding: "5rem 0" }}
    >
      <div className="wrap">
        {/* Foto placeholder — reemplazar con next/image cuando haya foto real */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/7",
            background: "rgba(244,234,219,0.06)",
            borderRadius: "16px",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(244,234,219,0.10)",
          }}
          aria-hidden="true"
        >
          {/* SVG placeholder visual */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <rect width="80" height="80" rx="16" fill="rgba(244,234,219,0.08)" />
            <circle cx="40" cy="28" r="12" stroke="rgba(244,234,219,0.3)" strokeWidth="2" fill="none" />
            <path d="M16 60 Q40 44 64 60" stroke="rgba(244,234,219,0.3)" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Texto */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            color: "#F4EADB",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          Detrás de Estación Snack
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.78)",
              lineHeight: 1.75,
            }}
          >
            Estación Snack partió en 2024 en una bodega chica de Santa Cruz, con una pesa, tres mezclas y la convicción de que los frutos secos no tenían por qué venir en bolsas industriales con más envase que contenido.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.78)",
              lineHeight: 1.75,
            }}
          >
            Probamos recetas durante meses. Algunas no pasaron el corte, como un mix con arándanos que se endurecía a los tres días. Otras se quedaron, como el Mix Europeo, que llevamos armando igual desde la primera vez.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.78)",
              lineHeight: 1.75,
            }}
          >
            Pesamos al momento, despachamos martes y viernes, y respondemos los mensajes nosotros mismos. No hay intermediarios ni bodega grande. Hay una pesa, un par de manos y ganas de que lo que comés sea bueno.
          </p>
        </div>
      </div>
    </section>
  );
}
