"use client";

import { useQuickEdit } from "./QuickEditContext";

export default function MeetingContentCard({ c }) {
  const { openEdit } = useQuickEdit();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openEdit("content", c.id)}
      onKeyDown={(e) => e.key === "Enter" && openEdit("content", c.id)}
      className="cursor-pointer bg-panel border border-line-soft rounded-[10px] p-4 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-[14px] text-text font-medium">{c.judul}</div>
        <span className="font-mono text-[12px] font-bold text-text bg-panel-raised px-2.5 py-1 rounded-md flex-shrink-0">
          {c.tanggal_posting
            ? new Date(c.tanggal_posting + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })
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
          
            href={c.link_referensi}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-vapor hover:underline"
          >
            Link Referensi ↗
          </a>
        )}
        {c.link_aset && (
          
            href={c.link_aset}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-vapor hover:underline"
          >
            Link Aset ↗
          </a>
        )}
      </div>
      <div className="mt-2 text-[10.5px] text-muted-dim">Klik kartu buat quick edit</div>
    </div>
  );
}