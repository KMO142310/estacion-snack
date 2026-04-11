// Camioneta de perfil — ícono de "despacho"
export default function Truck({ size = 32, className = "" }: { size?: number; className?: string }) {
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
      {/* Cuerpo principal */}
      <rect x="2" y="11" width="18" height="11" rx="1.5" />
      {/* Cabina */}
      <path d="M20 16 L20 22 L29 22 L29 17 L25 11 L20 11" />
      {/* Ventana cabina */}
      <path d="M21.5 12.5 L25 12.5 L28 17 L21.5 17 Z" opacity="0.4" stroke="currentColor" fill="currentColor" />
      {/* Rueda trasera */}
      <circle cx="7" cy="22" r="3" />
      <circle cx="7" cy="22" r="1.2" fill="currentColor" stroke="none" />
      {/* Rueda delantera */}
      <circle cx="24" cy="22" r="3" />
      <circle cx="24" cy="22" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
