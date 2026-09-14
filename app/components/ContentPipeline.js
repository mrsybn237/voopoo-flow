"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const STATUS_KOLOM = ["Brief", "Produksi", "Review", "Posting"];

const PILAR_COLOR = {
  Education: "var(--color-vapor)",
  Entertainment: "var(--color-ember)",
  Lifestyle: "var(--color-vapor)",
  Community: "var(--color-muted)",
  Promotional: "var(--color-ember)",
  Agile: "var(--color-muted)",
  Product: "var(--color-ember)",
};

function JenisIcon({ jenis, className }) {
  switch (jenis) {
    case "Reels":
    case "Video":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="5" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M17 9.5L21 7v10l-4-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "Carousel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="2" y="5" width="13" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="17" y="8" width="6" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        </svg>
      );
    case "Story":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="6" y="3" width="12" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="6.3" r="0.9" fill="currentColor" />
        </svg>
      );
    case "Live":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        </svg>
      );
    case "Single Post":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

export default function ContentPipeline({ content }) {
  const [search, setSearch] = useState("");
  const [pilarFilter, setPilarFilter] = useState("Semua");
  const [platformFilter, setPlatformFilter] = useState("Semua");

  const pilarOptions = useMemo(
    () => ["Semua", ...new Set(content.map((c) => c.pilar).filter(Boolean))],
    [content]
  );
  const platformOptions = useMemo(
    () => ["Semua", ...new Set(content.map((c) => c.platform).filter(Boolean))],
    [content]
  );

  const filtered = content.filter((c) => {
    const matchSearch = c.judul?.toLowerCase().includes(search.toLowerCase());
    const matchPilar = pilarFilter === "Semua" || c.pilar === pilarFilter;
    const matchPlatform = platformFilter === "Semua" || c.platform === platformFilter;
    return matchSearch && matchPilar && matchPlatform;
  });

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Content Pipeline</div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] text-muted-dim">{filtered.length} konten</div>
          <Link
            href="/tambah"
            className="bg-ember text-void font-semibold rounded-lg px-3 py-1.5 text-[12px] hover:glow-ember transition-shadow"
          >
            + Tambah
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input
          type="text"
          placeholder="Cari judul konten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim flex-1 min-w-[180px] focus:border-ember outline-none"
        />
        <select
          value={pilarFilter}
          onChange={(e) => setPilarFilter(e.target.value)}
          className="bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-muted"
        >
          {pilarOptions.map((p) => (
            <option key={p} value={p}>{p === "Semua" ? "Semua Pilar" : p}</option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-muted"
        >
          {platformOptions.map((p) => (
            <option key={p} value={p}>{p === "Semua" ? "Semua Platform" : p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {STATUS_KOLOM.map((status) => {
          const items = filtered.filter((c) => c.status === status);
          return (
            <div key={status} className="bg-panel border border-line-soft rounded-[10px] p-3.5">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="font-display text-[13px] font-semibold text-muted">{status}</div>
                <div className="font-mono text-[11px] text-muted-dim">{items.length}</div>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.length === 0 && (
                  <div className="text-[12px] text-muted-dim py-3 text-center">Kosong</div>
                )}
                {items.map((c) => (
                  <div key={c.id} className="relative group">
                    <Link
                      href={`/tambah/${c.id}`}
                      className="block bg-panel-raised border border-line-soft rounded-lg p-3 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-[13px] text-text leading-snug">{c.judul}</div>
                        <span className="flex items-center gap-1 flex-shrink-0 bg-ember-dim text-ember rounded px-1.5 py-0.5">
                          <JenisIcon jenis={c.jenis_konten} className="w-3 h-3" />
                          <span className="font-mono text-[9.5px]">{c.jenis_konten || "-"}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: PILAR_COLOR[c.pilar] || "var(--color-muted)" }}
                        />
                        <span className="font-mono text-[10.5px] text-muted-dim">{c.pilar || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] text-muted">{c.platform || "-"}</span>
                        <span className="font-mono text-[10.5px] text-muted-dim">
                          {c.tanggal_posting
                            ? new Date(c.tanggal_posting + "T00:00:00").toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })
                            : "-"}
                        </span>
                      </div>
                    </Link>

                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 z-20 opacity-0 scale-95 origin-top transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
                      <div className="bg-panel-raised border border-ember/40 glow-ember rounded-xl p-3.5 animate-float-in">
                        <div className="text-[12.5px] text-text font-medium mb-1.5">{c.judul}</div>
                        <div className="text-[11.5px] text-muted line-clamp-3 mb-2">
                          {c.brief || "Belum ada brief."}
                        </div>
                        <div className="flex items-center justify-between font-mono text-[10.5px]">
                          <span className="text-ember">{(c.views || 0).toLocaleString("id-ID")} views</span>
                          <span className="text-muted-dim">{c.pic || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}