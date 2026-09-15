const PILAR_COLOR = {
  Education: "var(--color-vapor)",
  Entertainment: "var(--color-ember)",
  Lifestyle: "var(--color-vapor)",
  Community: "var(--color-muted)",
  Promotional: "var(--color-ember)",
  Agile: "var(--color-muted)",
  Product: "var(--color-ember)",
};

function TypeIcon({ isTalent, className }) {
  if (isTalent) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className={className}>
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function TodayPanel({ content, talent }) {
  const items = [
    ...content.map((c) => ({ id: `c-${c.id}`, title: c.judul, sub: c.pilar, time: c.status, isTalent: false })),
    ...talent.map((t) => ({ id: `t-${t.id}`, title: `Deadline brief — ${t.nama_talent}`, sub: t.platform, time: "Talent", isTalent: true })),
  ];

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Hari Ini</div>
        <div className="font-mono text-[11px] text-muted-dim">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-[13px] text-muted-dim py-4">Gak ada konten atau deadline hari ini.</div>
      )}

      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-panel-raised transition-colors">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: item.isTalent ? "var(--color-vapor-dim)" : "var(--color-ember-dim)",
                color: item.isTalent ? "var(--color-vapor)" : "var(--color-ember)",
              }}
            >
              <TypeIcon isTalent={item.isTalent} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] text-text truncate">{item.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PILAR_COLOR[item.sub] || "var(--color-muted)" }} />
                <span className="font-mono text-[11px] text-muted-dim">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}