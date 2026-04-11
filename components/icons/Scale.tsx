// Pesa de platillos — ícono de "pesado al momento"
export default function Scale({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Soporte vertical */}
      <line x1="16" y1="6" x2="16" y2="26" />
      {/* Base */}
      <path d="M10 26 Q16 24 22 26" />
      {/* Barra horizontal */}
      <line x1="7" y1="10" x2="25" y2="10" />
      {/* Cadenas que sostienen platos */}
      <line x1="9" y1="10" x2="8" y2="16" />
      <line x1="23" y1="10" x2="24" y2="16" />
      {/* Plato izquierdo */}
      <path d="M5 17 Q8 15.5 11 17" />
      {/* Plato derecho */}
      <path d="M21 17 Q24 15.5 27 17" />
      {/* Pivote central */}
      <circle cx="16" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
