export default function MeetingContentCard({ content }) {
  const c = content;

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-4 transition-all hover:border-vapor/40 hover:glow-vapor">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-[14px] text-text font-medium">{c.judul}</div>
        <span className="font-mono text-[11px] text-muted-dim flex-shrink-0">
          {c.tanggal_posting
            ? new Date(c.tanggal_posting + "T00:00:00").toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            : "-"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted mb-2">
        <span>{c.pilar || "-"}</span>
        <span>·</span>
        <span>{c.platform || "-"}</span>
        <span>·</span>
        <span>{c.status || "-"}</span>
        <span>·</span>
        <span className="text-ember font-mono">{(c.views || 0).toLocaleString("id-ID")} views</span>
      </div>
      <div className="flex flex-wrap gap-3 text-[12px]">
        {c.link_referensi && (
          <a href={c.link_referensi} target="_blank" rel="noopener noreferrer" className="text-vapor hover:underline">
            Link Referensi ↗
          </a>
        )}
        {c.link_aset && (
          <a href={c.link_aset} target="_blank" rel="noopener noreferrer" className="text-vapor hover:underline">
            Link Aset ↗
          </a>
        )}
      </div>
    </div>
  );
}