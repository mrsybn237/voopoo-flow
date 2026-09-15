export default function Logo({ size = 44 }) {
  return (
    <div
      className="relative flex-shrink-0 transition-[filter] duration-300 hover:drop-shadow-[0_0_10px_var(--color-ember)]"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 28 28" width={size} height={size}>
        <g className="logo-ring">
          <circle cx="14" cy="14" r="12.5" stroke="var(--color-ember)" strokeWidth="1.3" fill="none" opacity="0.35" strokeDasharray="3.5 3" />
          <circle cx="14" cy="2.2" r="1.15" fill="var(--color-ember)" />
        </g>
        <circle cx="14" cy="14" r="9" stroke="var(--color-ember)" strokeWidth="1.4" fill="none" opacity="0.7" />
        <circle cx="14" cy="14" r="3.4" fill="var(--color-ember)" className="pulse-dot" />
      </svg>
    </div>
  );
}