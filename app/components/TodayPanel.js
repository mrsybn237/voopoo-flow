const PILAR_COLOR = {
  Education: "var(--color-vapor)",
  Entertainment: "var(--color-ember)",
  Lifestyle: "var(--color-vapor)",
  Community: "var(--color-muted)",
  Promotional: "var(--color-ember)",
  Agile: "var(--color-muted)",
  Product: "var(--color-ember)",
};

export default function TodayPanel({ content, talent }) {
  const items = [
    ...content.map((c) => ({
      id: `c-${c.id}`,
      title: c.judul,
      sub: c.pilar,
      time: c.status,
    })),
    ...talent.map((t) => ({
      id: `t-${t.id}`,
      title: `Deadline brief — ${t.nama_talent}`,
      sub: t.platform,
      time: "Talent",
    })),
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

      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-line-soft last:border-none">
          <div className="w-4 h-4 rounded border-[1.5px] border-muted-dim mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] text-text">{item.title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: PILAR_COLOR[item.sub] || "var(--color-muted)" }}
              />
              <span className="font-mono text-[11px] text-muted-dim">{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}