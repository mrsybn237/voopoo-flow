"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";
import { formatRelativeDate, deadlineUrgency } from "../lib/dateUtils";

const STATUS_KOLOM = ["Brief", "Produksi", "Review", "Posting"];

const PILAR_GRADIENT = {
  Education: "from-vapor/35 to-transparent",
  Entertainment: "from-ember/35 to-transparent",
  Lifestyle: "from-vapor/35 to-transparent",
  Community: "from-muted/35 to-transparent",
  Promotional: "from-ember/35 to-transparent",
  Agile: "from-muted/35 to-transparent",
  Product: "from-ember/35 to-transparent",
};

const PILAR_COLOR = {
  Education: "var(--color-vapor)",
  Entertainment: "var(--color-ember)",
  Lifestyle: "var(--color-vapor)",
  Community: "var(--color-muted)",
  Promotional: "var(--color-ember)",
  Agile: "var(--color-muted)",
  Product: "var(--color-ember)",
};

const PLATFORM_ICON = {
  "IG @voopoo_indonesia": "camera",
  "IG @voopoo_daily": "camera",
  "TikTok @voopoo_indonesia": "note",
};

const URGENCY_BADGE = {
  overdue: "bg-void/70 text-muted-dim",
  urgent: "bg-ember text-void",
  soon: "bg-ember-dim text-ember",
  normal: "bg-void/70 text-muted",
};

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "views", label: "Views Tertinggi" },
  { value: "deadline", label: "Deadline Terdekat" },
];

function PlatformIcon({ platform, className }) {
  const type = PLATFORM_ICON[platform];
  if (type === "note") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M15 4v10.5a3.5 3.5 0 11-2.5-3.36V4h2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M15 4c.3 2 1.8 3.4 4 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.6" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

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

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function ContentPipeline({ content }) {
  const router = useRouter();
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [pilarFilter, setPilarFilter] = useState("Semua");
  const [platformFilter, setPlatformFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [movingId, setMovingId] = useState(null);

  const pilarOptions = useMemo(
    () => ["Semua", ...new Set(content.map((c) => c.pilar).filter(Boolean))],
    [content]
  );
  const platformOptions = useMemo(
    () => [...new Set(content.map((c) => c.platform).filter(Boolean))],
    [content]
  );

  const urgentCount = useMemo(
    () =>
      content.filter((c) => {
        const u = deadlineUrgency(c.tanggal_posting);
        return u === "urgent" || u === "overdue";
      }).length,
    [content]
  );

  const hasActiveFilter =
    search !== "" || pilarFilter !== "Semua" || platformFilter !== "Semua" || onlyUrgent;

  function resetFilters() {
    setSearch("");
    setPilarFilter("Semua");
    setPlatformFilter("Semua");
    setOnlyUrgent(false);
  }

  async function moveStatus(c, direction) {
    const currentIndex = STATUS_KOLOM.indexOf(c.status);
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= STATUS_KOLOM.length) return;

    setMovingId(c.id);
    const { error } = await supabase
      .from("content_plan")
      .update({ status: STATUS_KOLOM[newIndex] })
      .eq("id", c.id);
    setMovingId(null);

    if (error) {
      alert(`Gagal mindahin status: ${error.message}`);
      return;
    }
    router.refresh();
  }

  const filtered = useMemo(() => {
    let result = content.filter((c) => {
      const matchSearch = c.judul?.toLowerCase().includes(search.toLowerCase());
      const matchPilar = pilarFilter === "Semua" || c.pilar === pilarFilter;
      const matchPlatform = platformFilter === "Semua" || c.platform === platformFilter;
      const matchUrgent =
        !onlyUrgent ||
        ["urgent", "overdue"].includes(deadlineUrgency(c.tanggal_posting));
      return matchSearch && matchPilar && matchPlatform && matchUrgent;
    });

    if (sortBy === "views") {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "deadline") {
      result = [...result].sort((a, b) => {
        if (!a.tanggal_posting) return 1;
        if (!b.tanggal_posting) return -1;
        return new Date(a.tanggal_posting) - new Date(b.tanggal_posting);
      });
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    return result;
  }, [content, search, pilarFilter, platformFilter, sortBy, onlyUrgent]);

  const maxViews = Math.max(1, ...filtered.map((c) => c.views || 0));
  const filterKey = `${search}-${pilarFilter}-${platformFilter}-${sortBy}-${onlyUrgent}`;

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="font-display text-sm font-semibold">Content Pipeline</div>
          {urgentCount > 0 && (
            <button
              onClick={() => setOnlyUrgent((v) => !v)}
              className={`font-mono text-[10.5px] rounded-full px-2 py-0.5 transition-colors ${
                onlyUrgent
                  ? "bg-ember text-void"
                  : "bg-ember-dim text-ember hover:glow-ember"
              }`}
              title="Klik buat filter konten yang deadline-nya mepet/lewat"
            >
              {urgentCount} mendesak
            </button>
          )}
        </div>
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

      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dim">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Cari judul konten..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-panel border border-line rounded-full pl-9 pr-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors"
          />
        </div>

        <select
          value={pilarFilter}
          onChange={(e) => setPilarFilter(e.target.value)}
          className="bg-panel border border-line rounded-full px-3.5 py-2 text-[12.5px] text-muted hover:border-ember/50 transition-colors"
        >
          {pilarOptions.map((p) => (
            <option key={p} value={p}>{p === "Semua" ? "Semua Pilar" : p}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-panel border border-line rounded-full px-3.5 py-2 text-[12.5px] text-muted hover:border-ember/50 transition-colors"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 bg-panel border border-line rounded-full p-1">
          <button
            onClick={() => setPlatformFilter("Semua")}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-mono transition-colors ${
              platformFilter === "Semua" ? "bg-ember-dim text-ember" : "text-muted-dim hover:text-text"
            }`}
          >
            Semua
          </button>
          {platformOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              title={p}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                platformFilter === p ? "bg-ember-dim text-ember" : "text-muted-dim hover:text-text"
              }`}
            >
              <PlatformIcon platform={p} className="w-4 h-4" />
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            className="text-[11.5px] text-muted-dim hover:text-ember transition-colors flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Reset filter
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-panel border border-dashed border-line rounded-[10px] py-10 text-center">
          <div className="text-[13px] text-muted mb-1">Gak ada konten yang cocok.</div>
          <button onClick={resetFilters} className="text-[12px] text-ember hover:underline">
            Reset filter
          </button>
        </div>
      ) : (
        <div key={filterKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 animate-fade-in">
          {STATUS_KOLOM.map((status, statusIndex) => {
            const items = filtered.filter((c) => c.status === status);
            return (
              <div key={status} className="bg-panel border border-line-soft rounded-[10px] p-3.5">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="font-display text-[13px] font-semibold text-muted">{status}</div>
                  <div className="font-mono text-[11px] text-muted-dim">{items.length}</div>
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 && (
                    <div className="text-[12px] text-muted-dim py-3 text-center">Kosong</div>
                  )}
                  {items.map((c) => {
                    const pct = Math.round(((c.views || 0) / maxViews) * 100);
                    const urgency = deadlineUrgency(c.tanggal_posting);
                    const isMoving = movingId === c.id;
                    const canMoveLeft = statusIndex > 0;
                    const canMoveRight = statusIndex < STATUS_KOLOM.length - 1;

                    return (
                      <div key={c.id} className="relative group">
                        <Link
                          href={`/tambah/${c.id}`}
                          className="block bg-panel-raised border border-line-soft rounded-xl overflow-hidden transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
                        >
                          <div
                            className={`relative h-[64px] bg-gradient-to-br ${PILAR_GRADIENT[c.pilar] || "from-muted/30 to-transparent"} flex items-center justify-center overflow-hidden`}
                          >
                            <JenisIcon jenis={c.jenis_konten} className="w-9 h-9 text-text/10 absolute" />

                            {c.tanggal_posting && (
                              <span className={`absolute top-2 left-2 font-mono text-[9.5px] rounded-md px-1.5 py-0.5 ${URGENCY_BADGE[urgency]}`}>
                                {formatRelativeDate(c.tanggal_posting)}
                              </span>
                            )}

                            <span className="absolute top-2 right-2 flex items-center gap-1 bg-void/70 backdrop-blur-sm text-ember rounded-md px-1.5 py-0.5">
                              <JenisIcon jenis={c.jenis_konten} className="w-3 h-3" />
                              <span className="font-mono text-[9.5px]">{c.jenis_konten || "-"}</span>
                            </span>

                            <div className="absolute -bottom-3.5 left-2.5 w-7 h-7 rounded-full bg-panel border-2 border-panel-raised flex items-center justify-center">
                              <span className="font-mono text-[9.5px] text-ember font-semibold">{initials(c.pic)}</span>
                            </div>
                          </div>

                          <div className="pt-4 px-3 pb-3">
                            <div className="text-[13px] text-text leading-snug mb-1.5 line-clamp-2">{c.judul}</div>
                            <div className="text-[10px] text-muted-dim mb-2">{c.pic || "Belum ada PIC"}</div>

                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: PILAR_COLOR[c.pilar] || "var(--color-muted)" }}
                              />
                              <span className="font-mono text-[10.5px] text-muted-dim">{c.pilar || "-"}</span>
                            </div>

                            <div className="flex items-center justify-between mb-2.5">
                              <span className="flex items-center gap-1 text-[10.5px] text-muted">
                                <PlatformIcon platform={c.platform} className="w-3 h-3" />
                                {c.platform?.split(" ")[0] || "-"}
                              </span>
                              <span className="flex items-center gap-1 font-mono text-[10.5px] text-muted-dim">
                                <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
                                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
                                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                                </svg>
                                {(c.views || 0).toLocaleString("id-ID")}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9.5px] text-muted-dim">Performa relatif</span>
                              <span className="font-mono text-[9.5px] text-ember">{pct}%</span>
                            </div>
                            <div className="h-1 bg-line-soft rounded-full overflow-hidden">
                              <div
                                className="h-full bg-ember rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center justify-between mt-1.5 px-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            type="button"
                            disabled={!canMoveLeft || isMoving}
                            onClick={(e) => {
                              e.preventDefault();
                              moveStatus(c, -1);
                            }}
                            className="w-6 h-6 rounded-full bg-panel border border-line-soft flex items-center justify-center text-muted-dim hover:text-ember hover:border-ember/40 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                            title={canMoveLeft ? `Pindah ke ${STATUS_KOLOM[statusIndex - 1]}` : ""}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {isMoving && (
                            <span className="font-mono text-[9.5px] text-muted-dim">Menyimpan...</span>
                          )}

                          <button
                            type="button"
                            disabled={!canMoveRight || isMoving}
                            onClick={(e) => {
                              e.preventDefault();
                              moveStatus(c, 1);
                            }}
                            className="w-6 h-6 rounded-full bg-panel border border-line-soft flex items-center justify-center text-muted-dim hover:text-ember hover:border-ember/40 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                            title={canMoveRight ? `Pindah ke ${STATUS_KOLOM[statusIndex + 1]}` : ""}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>

                        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 z-20 opacity-0 scale-95 origin-top transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
                          <div className="bg-panel-raised border border-ember/40 glow-ember rounded-xl p-3.5 animate-float-in">
                            <div className="text-[12.5px] text-text font-medium mb-1.5">{c.judul}</div>
                            <div className="text-[11.5px] text-muted line-clamp-3 mb-2">
                              {c.brief || "Belum ada brief."}
                            </div>
                            <div className="flex items-center justify-between font-mono text-[10.5px]">
                              <span className="text-ember">{(c.views || 0).toLocaleString("id-ID")} views</span>
                              <span className="text-muted-dim">{formatRelativeDate(c.tanggal_posting)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}