"use client";

import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import NavTabs from "./NavTabs";
import Logo from "./Logo";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function greetingFor(hour) {
  if (hour < 10) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

export default function Topbar({ onOpenPalette }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const clockText = now
    ? `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "—";

  const greeting = now ? greetingFor(now.getHours()) : "Halo";

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between pb-7 border-b border-line-soft">
        <div className="flex items-center gap-4">
          <Logo size={44} />
          <div>
            <div className="font-display font-semibold text-[19px] tracking-wide leading-tight">
              VOOPOO Indonesia
            </div>
            <div className="text-muted text-[12.5px] mt-0.5">
              {greeting}, <span className="text-vapor">Han</span>
              <span className="text-muted-dim"> — Head Creative</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-panel border border-line-soft rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ember pulse-dot" />
            <span className="font-mono text-[11px] text-muted">Sistem aktif</span>
          </div>

          <div className="font-mono text-[13px] text-muted text-right leading-tight hidden sm:block">
            {clockText}
          </div>

          {onOpenPalette && (
            <button
              onClick={onOpenPalette}
              className="group bg-panel border border-line text-muted px-4 py-2.5 rounded-xl text-[13.5px] flex items-center gap-2.5 transition-all duration-200 hover:border-ember hover:text-text hover:glow-ember hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" className="text-muted-dim group-hover:text-ember transition-colors">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Cari atau tambah
              <kbd className="font-mono text-[11px] bg-void border border-line rounded px-1.5 py-0.5 text-muted-dim group-hover:text-ember group-hover:border-ember/40 transition-colors">
                ⌘K
              </kbd>
            </button>
          )}

          <LogoutButton />
        </div>
      </div>
      <div className="pt-6">
        <NavTabs />
      </div>
    </div>
  );
}