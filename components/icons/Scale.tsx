// Pesa de platillos — ícono "pesado al momento"
// Trazo deliberadamente irregular (pluma a mano, no Heroicons).
export default function Scale({ size = 32, className = "" }: { size?: number; className?: string }) {
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
      {/* Soporte vertical con ligera curva */}
      <path d="M16.1 6.2 Q15.9 15.8 16.2 25.9" />
      {/* Base irregular */}
      <path d="M9.6 26.3 Q13 23.9 16.1 24.3 Q19.2 24.6 22.4 26.2" />
      {/* Barra horizontal temblona */}
      <path d="M6.8 9.8 Q11.5 9.6 16.1 10.1 Q20.6 10.3 25.2 9.9" />
      {/* Cadenas */}
      <path d="M9.1 10.1 Q8.6 12.8 7.9 16.1" />
      <path d="M23.1 10 Q23.7 12.9 24.1 16.2" />
      {/* Plato izquierdo */}
      <path d="M4.8 17.3 Q8.1 15.4 11.2 17" />
      {/* Plato derecho */}
      <path d="M20.9 17.1 Q24.2 15.3 27.3 17.2" />
      {/* Pivote central */}
      <circle cx="16.1" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
