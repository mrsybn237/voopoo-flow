export default function Logo({ size = 28 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 28 28" width={size} height={size}>
        <circle cx="14" cy="14" r="12.5" stroke="var(--color-ember)" strokeWidth="1.4" fill="none" opacity="0.35" />
        <circle cx="14" cy="14" r="9" stroke="var(--color-ember)" strokeWidth="1.4" fill="none" />
        <circle cx="14" cy="14" r="3.2" fill="var(--color-ember)" className="pulse-dot" />
        <circle cx="14" cy="2.2" r="1.1" fill="var(--color-ember)" />
      </svg>
    </div>
  );
}