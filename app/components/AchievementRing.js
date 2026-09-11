"use client";

import { useEffect, useState } from "react";

export default function AchievementRing({ achievementPct, totalKonten, targetKonten, todayDone, todayTotal }) {
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += 2;
      setDisplayPct(Math.min(n, achievementPct));
      if (n >= achievementPct) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [achievementPct]);

  const kontenPct = targetKonten > 0 ? Math.min(1, totalKonten / targetKonten) : 0;
  const taskPct = todayTotal > 0 ? Math.min(1, todayDone / todayTotal) : 0;
  const kpiPct = Math.min(1, achievementPct / 100);

  const rOuter = 98, rMid = 78, rInner = 58;
  const cOuter = 2 * Math.PI * rOuter;
  const cMid = 2 * Math.PI * rMid;
  const cInner = 2 * Math.PI * rInner;

  return (
    <div className="flex items-center justify-center gap-14 py-5 pb-11 flex-wrap">
      <div className="relative w-[220px] h-[220px] flex-shrink-0">
        <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
          <circle cx="110" cy="110" r={rOuter} stroke="var(--color-line)" strokeWidth="3" fill="none" />
          <circle
            cx="110" cy="110" r={rOuter} stroke="var(--color-vapor)" strokeWidth="3" fill="none"
            strokeLinecap="round" strokeDasharray={cOuter}
            strokeDashoffset={cOuter * (1 - taskPct)}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1)" }}
          />
          <circle cx="110" cy="110" r={rMid} stroke="var(--color-line)" strokeWidth="3" fill="none" />
          <circle
            cx="110" cy="110" r={rMid} stroke="var(--color-muted-dim)" strokeWidth="3" fill="none"
            strokeLinecap="round" strokeDasharray={cMid}
            strokeDashoffset={cMid * (1 - kontenPct)}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1)" }}
          />
          <circle cx="110" cy="110" r={rInner} stroke="var(--color-line)" strokeWidth="4" fill="none" />
          <circle
            cx="110" cy="110" r={rInner} stroke="var(--color-ember)" strokeWidth="4" fill="none"
            strokeLinecap="round" strokeDasharray={cInner}
            strokeDashoffset={cInner * (1 - kpiPct)}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-display text-4xl font-bold text-ember leading-none">{displayPct}%</div>
          <div className="text-xs text-muted mt-1.5 max-w-[120px] leading-tight">Achievement bulan ini</div>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-ember flex-shrink-0" />
          <span className="text-[13px] text-muted">Achievement KPI — <b className="text-text font-semibold font-mono">{achievementPct}%</b></span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-muted-dim flex-shrink-0" />
          <span className="text-[13px] text-muted">Konten bulan ini — <b className="text-text font-semibold font-mono">{totalKonten}/{targetKonten || "?"}</b></span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-vapor flex-shrink-0" />
          <span className="text-[13px] text-muted">Task hari ini — <b className="text-text font-semibold font-mono">{todayDone}/{todayTotal}</b></span>
        </div>
      </div>
    </div>
  );
}