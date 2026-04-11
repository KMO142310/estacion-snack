// Burbuja de chat con punta — ícono de "pedido por WhatsApp"
export default function Chat({ size = 32, className = "" }: { size?: number; className?: string }) {
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
      {/* Burbuja */}
      <path d="M4 6 Q4 4 6 4 L26 4 Q28 4 28 6 L28 20 Q28 22 26 22 L12 22 L6 27 L7 22 L6 22 Q4 22 4 20 Z" />
      {/* Líneas de texto */}
      <line x1="9" y1="11" x2="23" y2="11" opacity="0.5" />
      <line x1="9" y1="15" x2="18" y2="15" opacity="0.5" />
    </svg>
  );
}
