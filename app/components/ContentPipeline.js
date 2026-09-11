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
            className="bg-ember text-void font-semibold rounded-lg px-3 py-1.5 text-[12px]"
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
                  <Link
                    href={`/tambah/${c.id}`}
                    key={c.id}
                    className="block bg-panel-raised border border-line-soft rounded-lg p-3 hover:border-ember transition-colors"
                  >
                    <div className="text-[13px] text-text leading-snug mb-2">{c.judul}</div>
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}