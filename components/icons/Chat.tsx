// Burbuja de chat — "pedido por WhatsApp"
// Trazo deliberadamente irregular (pluma a mano).
export default function Chat({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Burbuja con curvas imperfectas */}
      <path d="M4.2 6.1 Q4 4.1 6.1 3.9 L25.8 4 Q28 4.1 28.1 6.2 L28 19.8 Q28.1 21.9 26 22.1 L12.2 22 L5.9 27 L7 22.1 L6.1 22 Q4 22.1 4.1 19.9 Z" />
      {/* Líneas de texto irregulares */}
      <path d="M9.1 11 Q15.8 10.8 22.9 11.1" opacity="0.55" />
      <path d="M9 15 Q13.4 14.8 17.9 15.1" opacity="0.55" />
    </svg>
  );
}
