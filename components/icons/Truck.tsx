// Camioneta de perfil — "despacho martes a sábado"
// Trazo deliberadamente irregular (pluma a mano).
export default function Truck({ size = 32, className = "" }: { size?: number; className?: string }) {
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
      {/* Cuerpo con curvas mínimas en esquinas */}
      <path d="M2.3 12 Q2.1 11.2 2.9 11.1 L19.6 11.1 Q20.2 11.3 20.1 12 L20 21.9 Q19.9 22.6 19.2 22.5 L3 22.5 Q2.2 22.4 2.2 21.6 Z" />
      {/* Cabina */}
      <path d="M20.1 16.1 Q20 19.1 20.2 22.4 L28.9 22.4 Q29.1 19.8 28.8 17.1 Q26.9 13.9 24.9 11 L20.2 11.1" />
      {/* Ventana cabina */}
      <path d="M21.6 12.5 L24.9 12.5 Q26.5 14.7 27.9 16.9 L21.6 16.9 Z" opacity="0.38" stroke="currentColor" fill="currentColor" />
      {/* Rueda trasera */}
      <circle cx="7" cy="22" r="3.1" />
      <circle cx="7" cy="22" r="1.25" fill="currentColor" stroke="none" />
      {/* Rueda delantera */}
      <circle cx="24.1" cy="22" r="3.1" />
      <circle cx="24.1" cy="22" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
