export default function Plus({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="9" y1="2" x2="9" y2="16" />
      <line x1="2" y1="9" x2="16" y2="9" />
    </svg>
  );
}
