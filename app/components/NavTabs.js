"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Dashboard" },
  { href: "/meeting", label: "Meeting" },
  { href: "/tambah", label: "Tambah" },
  { href: "/kelola-talent", label: "Talent" },
  { href: "/panduan", label: "Panduan" },
];

export default function NavTabs() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href)))
  );

  return (
    <div className="relative flex items-center gap-1 bg-panel border border-line-soft rounded-2xl p-1.5">
      <div
        className="absolute top-1.5 bottom-1.5 rounded-xl bg-ember-dim border border-ember transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / TABS.length}% - 6px)`,
          left: `calc(${(activeIndex * 100) / TABS.length}% + 3px)`,
        }}
      />
      {TABS.map((tab, i) => {
        const isActive = i === activeIndex;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative z-10 flex-1 text-center px-5 py-2.5 rounded-xl text-[13.5px] font-display font-medium transition-colors duration-200 ${
              isActive ? "text-ember" : "text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}