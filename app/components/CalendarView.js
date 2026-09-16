"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase-browser";
import { toISODate } from "../lib/dateUtils";

const HARI_HEADER = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
const BULAN_NAMA = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function CalendarView() {
  const supabase = createClient();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [jadwalTalent, setJadwalTalent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedISO, setSelectedISO] = useState(null);
  const [talentWarning, setTalentWarning] = useState(false);

  const todayISO = toISODate(new Date());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const rangeStart = toISODate(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 25));
      const rangeEnd = toISODate(new Date(cursor.getFullYear(), cursor.getMonth() + 2, 5));

      const [contentRes, eventsRes] = await Promise.all([
        supabase
          .from("content_plan")
          .select("*")
          .gte("tanggal_posting", rangeStart)
          .lte("tanggal_posting", rangeEnd),
        supabase
          .from("events")
          .select("*")
          .lte("tanggal_mulai", rangeEnd)
          .gte("tanggal_selesai", rangeStart),
      ]);

      let talentRows = [];
      let talentError = false;
      try {
        const { data, error } = await supabase
          .from("jadwal_talent")
          .select("*, talent_collab(nama_talent), lokasi_shooting(nama_lokasi)")
          .gte("tanggal", rangeStart)
          .lte("tanggal", rangeEnd);
        if (error) {
          talentError = true;
        } else {
          talentRows = data || [];
        }
      } catch (_) {
        talentError = true;
      }

      if (!cancelled) {
        setContent(contentRes.data || []);
        setEvents(eventsRes.data || []);
        setJadwalTalent(talentRows);
        setTalentWarning(talentError);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cursor]);

  const weeks = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (firstOfMonth.getDay() + 6) % 7; // Senin = 0
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - offset);

    const days = Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });

    const rows = [];
    for (let i = 0; i < 6; i++) rows.push(days.slice(i * 7, i * 7 + 7));
    return rows;
  }, [cursor]);

  function itemsForDay(iso) {
    const c = content.filter((x) => x.tanggal_posting === iso);
    const e = events.filter((x) => iso >= x.tanggal_mulai && iso <= x.tanggal_selesai);
    const t = jadwalTalent.filter((x) => x.tanggal === iso);
    return { c, e, t, total: c.length + e.length + t.length };
  }

  const selected = selectedISO ? itemsForDay(selectedISO) : null;

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-sm font-semibold">
          {BULAN_NAMA[cursor.getMonth()]} {cursor.getFullYear()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="w-7 h-7 rounded-lg border border-line-soft text-muted hover:border-ember/50 hover:text-ember transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={() => {
              const d = new Date();
              setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
              setSelectedISO(null);
            }}
            className="font-mono text-[11px] text-muted-dim hover:text-ember transition-colors px-2"
          >
            Hari ini
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="w-7 h-7 rounded-lg border border-line-soft text-muted hover:border-ember/50 hover:text-ember transition-colors flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      {talentWarning && (
        <div className="text-[11px] text-muted-dim bg-panel-raised border border-line-soft rounded-lg px-3 py-2 mb-4">
          Data Jadwal Talent belum bisa dimuat (tabel mungkin belum siap) — kalender tetap jalan buat Content & Event.
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 mb-1">
        {HARI_HEADER.map((h) => (
          <div key={h} className="text-center font-mono text-[10px] text-muted-dim py-1">
            {h}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${loading ? "opacity-40" : "opacity-100"}`}>
        {weeks.flat().map((d) => {
          const iso = toISODate(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = iso === todayISO;
          const isSelected = iso === selectedISO;
          const { c, e, t, total } = itemsForDay(iso);

          return (
            <button
              key={iso}
              onClick={() => setSelectedISO(isSelected ? null : iso)}
              className={`aspect-square min-h-[54px] flex flex-col items-start p-1.5 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? "bg-ember-dim border-ember glow-ember"
                  : isToday
                  ? "border-ember/50 bg-panel-raised"
                  : "border-transparent hover:border-line-soft hover:bg-panel-raised"
              } ${!inMonth ? "opacity-30" : ""}`}
            >
              <span className={`font-mono text-[10.5px] ${isToday ? "text-ember font-semibold" : "text-muted"}`}>
                {d.getDate()}
              </span>
              <div className="flex flex-wrap gap-0.5 mt-auto">
                {c.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-ember" />}
                {e.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-vapor" />}
                {t.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-muted" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 font-mono text-[10px] text-muted-dim">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-ember" /> Konten</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-vapor" /> Event</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-muted" /> Jadwal Talent</span>
      </div>

      {selected && (
        <div className="mt-5 pt-5 border-t border-line-soft animate-fade-in">
          <div className="font-mono text-[11px] text-muted-dim mb-3">
            {new Date(selectedISO + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </div>

          {selected.total === 0 && (
            <div className="text-[13px] text-muted-dim">Gak ada yang dijadwalkan hari ini.</div>
          )}

          <div className="flex flex-col gap-2">
            {selected.c.map((item) => (
              <Link key={`c-${item.id}`} href={`/tambah/${item.id}`} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-panel-raised transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-ember flex-shrink-0" />
                <span className="text-[13px] text-text truncate">{item.judul}</span>
                <span className="font-mono text-[10px] text-muted-dim ml-auto">{item.status}</span>
              </Link>
            ))}
            {selected.e.map((item) => (
              <Link key={`e-${item.id}`} href={`/kelola-event/${item.id}`} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-panel-raised transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-vapor flex-shrink-0" />
                <span className="text-[13px] text-text truncate">{item.nama_event}</span>
                <span className="font-mono text-[10px] text-muted-dim ml-auto">{item.lokasi || "-"}</span>
              </Link>
            ))}
            {selected.t.map((item) => (
              <div key={`t-${item.id}`} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-panel-raised transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-muted flex-shrink-0" />
                <span className="text-[13px] text-text truncate">
                  {item.talent_collab?.nama_talent || "Talent"} — {item.lokasi_shooting?.nama_lokasi || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}