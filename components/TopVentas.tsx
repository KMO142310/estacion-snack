import Image from "next/image";
import productsData from "@/data/products.json";

const topVentas = [
  { id: "1", occasion: "El repetido de todos los jueves." },
  { id: "4", occasion: "El que se acaba primero en cualquier mesa." },
  { id: "6", occasion: "Para los que saben lo que quieren." },
];

export default function TopVentas() {
  const featured = topVentas
    .map(({ id, occasion }) => {
      const p = productsData.find((pr) => pr.id === id);
      return p ? { ...p, occasion } : null;
    })
    .filter(Boolean) as (typeof productsData[number] & { occasion: string })[];

  return (
    <section
      aria-label="Lo que más se vende"
      style={{ background: "#5A1F1A", padding: "5rem 0" }}
    >
      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
              color: "#F4EADB",
              lineHeight: 1.15,
              marginBottom: "0.625rem",
            }}
          >
            Lo que más sale
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "rgba(244,234,219,0.65)",
              lineHeight: 1.6,
            }}
          >
            Estos tres son los que piden casi siempre los que ya saben lo que quieren.
          </p>
        </div>

        {/* Carrusel horizontal — scroll snap */}
        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "1.25rem",
            paddingBottom: "0.5rem",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {featured.map((product) => (
            <a
              key={product.id}
              href="#productos"
              aria-label={`Ver ${product.name} en el catálogo`}
              style={{
                flexShrink: 0,
                width: "72vw",
                maxWidth: 280,
                scrollSnapAlign: "start",
                background: "rgba(244,234,219,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(244,234,219,0.10)",
                textDecoration: "none",
              }}
            >
              {/* Imagen */}
              <div style={{ aspectRatio: "4/3", background: "rgba(244,234,219,0.05)", position: "relative" }}>
                <Image
                  src={product.image_webp_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 72vw, 280px"
                  style={{ objectFit: "cover" }}
                />
                {product.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "#D0551F",
                      color: "#F4EADB",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "0.875rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#F4EADB",
                    marginBottom: "0.25rem",
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "rgba(244,234,219,0.65)",
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    marginBottom: "0.625rem",
                  }}
                >
                  &ldquo;{product.occasion}&rdquo;
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "#D0551F",
                  }}
                >
                  ${product.price.toLocaleString("es-CL")}/kg
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA linkstyle */}
        <div style={{ marginTop: "1.75rem" }}>
          <a
            href="#productos"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color: "#D0551F",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Ver todas las mezclas
          </a>
        </div>
      </div>
    </section>
  );
}
