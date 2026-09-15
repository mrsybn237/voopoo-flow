"use client";

import { useEffect, useState } from "react";

export default function KpiPanel({ totalViews, achievementPct, targetViews }) {
  const [displayViews, setDisplayViews] = useState(0);

  useEffect(() => {
    let raf;
    const duration = 700;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplayViews(Math.round(totalViews * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalViews]);

  const formatted = displayViews >= 1000 ? `${(displayViews / 1000).toFixed(1)}K` : String(displayViews);
  const barPct = Math.min(100, achievementPct);

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line hover:glow-ember transition-all duration-300">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">KPI Bulanan</div>
        <div className="font-mono text-[11px] text-muted-dim">
          {new Date().toLocaleDateString("id-ID", { month: "long" })}
        </div>
      </div>
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="font-display text-[28px] font-bold tabular-nums">{formatted}</div>
          <div className="text-[11.5px] text-muted mt-0.5">
            Total views {targetViews > 0 && `(target ${(targetViews / 1000).toFixed(0)}K)`}
          </div>
        </div>
        <div className="font-mono text-xs text-ember">{achievementPct}% target</div>
      </div>
      <div className="h-1.5 bg-line-soft rounded-full overflow-hidden">
        <div className="h-full bg-ember rounded-full transition-all duration-700" style={{ width: `${barPct}%` }} />
      </div>
    </div>
  );
}