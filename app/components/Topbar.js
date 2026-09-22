"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import NavTabs from "./NavTabs";
import Logo from "./Logo";
import { createClient } from "../lib/supabase-browser";

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
  const [me, setMe] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("team_members")
        .select("nama, role, is_admin")
        .eq("email", user.email)
        .maybeSingle();
      setMe(data);
    });

    return () => clearInterval(id);
  }, []);

  const clockText = now
    ? `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "—";

  const greeting = now ? greetingFor(now.getHours()) : "Halo";

  return (
    <div className="sticky top-0 z-30 bg-void/85 backdrop-blur-xl border-b border-line-soft mb-10">
      <div className="px-6 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <Logo size={52} />
            <div>
              <div className="font-display font-semibold text-[22px] tracking-wide leading-tight">
                VOOPOO Indonesia
              </div>
              <div className="text-muted text-[13.5px] mt-1">
                {greeting}, <span className="text-vapor">{me?.nama || "..."}</span>
                {me?.role && <span className="text-muted-dim"> — {me.role}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 bg-panel border border-line-soft rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-ember pulse-dot" />
              <span className="font-mono text-[12px] text-muted">Sistem aktif</span>
            </div>

            <div className="font-mono text-[14px] text-muted text-right leading-tight hidden sm:block">
              {clockText}
            </div>

            {onOpenPalette && (
              <button
                onClick={onOpenPalette}
                className="group bg-panel border border-line text-muted px-5 py-3 rounded-xl text-[14.5px] flex items-center gap-3 transition-all duration-200 hover:border-ember hover:text-text hover:glow-ember hover:scale-[1.03] press-effect"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="text-muted-dim group-hover:text-ember transition-colors">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Cari atau tambah
                <kbd className="font-mono text-[12px] bg-void border border-line rounded px-2 py-1 text-muted-dim group-hover:text-ember group-hover:border-ember/40 transition-colors">
                  ⌘K
                </kbd>
              </button>
            )}

            {me?.is_admin && (
              <Link
                href="/admin/kelola-tim"
                title="Kelola Tim"
                className="w-11 h-11 flex items-center justify-center bg-panel border border-line rounded-xl text-muted-dim hover:text-ember hover:border-ember transition-colors press-effect"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019 9c.36.13.68.36.93.66"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            )}

            <LogoutButton />
          </div>
        </div>
        <div className="pb-6">
          <NavTabs />
        </div>
      </div>
    </div>
  );
}