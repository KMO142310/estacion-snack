// Bolsa de compras — ícono de carrito
export default function ShoppingBag({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 2 L3 6 L3 20 Q3 22 5 22 L19 22 Q21 22 21 20 L21 6 L18 2 Z" />
      <path d="M3 6 L21 6" />
      <path d="M16 10 Q16 14 12 14 Q8 14 8 10" />
    </svg>
  );
}
