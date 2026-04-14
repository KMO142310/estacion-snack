// Hito kilométrico — marca visual signature de Estación Snack.
// Inspirado en los hitos concretos del ramal ferroviario chileno:
// círculo concéntrico blanco con número en itálica.
//
// NO es una reproducción del hito histórico real del km 35,5 —
// es un elemento de marca que toma la forma prestada.
interface Props {
  size?: number;
  dark?: boolean; // variante para fondos oscuros (burdeo)
  className?: string;
  ariaLabel?: string;
}

export default function KmStone({ size = 64, dark = false, className, ariaLabel }: Props) {
  const bg = dark ? "#F4EADB" : "#F4EADB";
  const stroke = dark ? "#F4EADB" : "#5A1F1A";
  const innerStroke = dark ? "rgba(90,31,26,0.35)" : "rgba(90,31,26,0.35)";
  const kmColor = dark ? "#5A1F1A" : "#5A1F1A";
  const numColor = "#A8411A";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={className}
    >
      {/* Disco exterior */}
      <circle cx="40" cy="40" r="38" fill={bg} stroke={stroke} strokeWidth="1.5" />
      {/* Filete interior — convención hito Chile */}
      <circle cx="40" cy="40" r="33" fill="none" stroke={innerStroke} strokeWidth="0.75" />
      {/* Label "KM" */}
      <text
        x="40"
        y="33"
        textAnchor="middle"
        fontFamily="var(--font-body), system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="2"
        fill={kmColor}
      >
        KM
      </text>
      {/* Número — Fraunces italic, el sello editorial de la marca */}
      <text
        x="40"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontStyle="italic"
        fontSize="22"
        fontWeight="600"
        fill={numColor}
      >
        35,5
      </text>
    </svg>
  );
}
