export default function KpiPanel({ totalViews, achievementPct, targetViews }) {
  const formatted =
    totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews);

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">KPI Bulanan</div>
        <div className="font-mono text-[11px] text-muted-dim">
          {new Date().toLocaleDateString("id-ID", { month: "long" })}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="font-display text-[28px] font-bold">{formatted}</div>
          <div className="text-[11.5px] text-muted mt-0.5">
            Total views {targetViews > 0 && `(target ${(targetViews / 1000).toFixed(0)}K)`}
          </div>
        </div>
        <div className="font-mono text-xs text-ember">{achievementPct}% target</div>
      </div>
    </div>
  );
}