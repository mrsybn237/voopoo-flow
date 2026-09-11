"use client";

import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function Topbar({ onOpenPalette }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const clockText = now
    ? `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "—";

  return (
    <div className="flex items-center justify-between pb-5 border-b border-line-soft mb-8">
      <div className="flex items-center gap-2.5">
        <div className="relative w-7 h-7 rounded-full border-[1.5px] border-ember flex-shrink-0 after:content-[''] after:absolute after:inset-2 after:rounded-full after:bg-ember" />
        <div className="font-display font-semibold text-[15px] tracking-wide">
          VOOPOO Indonesia <span className="text-muted font-medium">/ Han — Head Creative</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="font-mono text-[13px] text-muted text-right leading-tight">
          {clockText}
        </div>
        <button
          onClick={onOpenPalette}
          className="bg-panel border border-line text-muted px-3 py-1.5 rounded-lg text-[13px] flex items-center gap-2 hover:border-ember hover:text-text transition-colors"
        >
          Cari atau tambah
          <kbd className="font-mono text-[11px] bg-void border border-line rounded px-1.5 py-0.5 text-muted">⌘K</kbd>
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}