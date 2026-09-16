"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Dashboard" },
  { href: "/meeting", label: "Meeting" },
  { href: "/tambah", label: "Tambah" },
  { href: "/kelola", label: "Kelola", isDropdown: true },
  { href: "/panduan", label: "Panduan" },
];

const KELOLA_LINKS = [
  { href: "/kelola-talent", label: "Talent" },
  { href: "/kelola-event", label: "Event" },
  { href: "/kelola-lokasi", label: "Lokasi Shooting" },
  { href: "/kelola-jadwal-talent", label: "Jadwal Talent" },
  { href: "/kelola-pembiayaan", label: "Pembiayaan" },
];

export default function NavTabs() {
  const pathname = usePathname();

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => {
      if (t.isDropdown) {
        return KELOLA_LINKS.some((l) => pathname.startsWith(l.href));
      }
      return t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
    })
  );

  return (
    <div className="relative flex items-center gap-1.5 bg-panel border border-line-soft rounded-2xl p-2">
      <div
        className="absolute top-2 bottom-2 rounded-xl bg-ember-dim border border-ember glow-ember transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / TABS.length}% - 8px)`,
          left: `calc(${(activeIndex * 100) / TABS.length}% + 4px)`,
        }}
      />
      {TABS.map((tab, i) => {
        const isActive = i === activeIndex;

        if (tab.isDropdown) {
          return (
            <div key={tab.href} className="relative z-10 flex-1 group">
              <button
                type="button"
                className={`w-full text-center px-4 py-3.5 rounded-xl text-[14px] font-display font-semibold transition-colors duration-200 ${
                  isActive ? "text-ember" : "text-muted group-hover:text-text"
                }`}
              >
                {tab.label}
              </button>
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full pt-2 w-48 opacity-0 scale-95 origin-top transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
                <div className="bg-panel-raised border border-line rounded-xl p-1.5 glow-vapor animate-float-in">
                  {KELOLA_LINKS.map((link) => {
                    const linkActive = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 rounded-lg text-[13px] transition-colors ${
                          linkActive ? "text-ember bg-ember-dim" : "text-muted hover:text-text hover:bg-panel"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative z-10 flex-1 text-center px-4 py-3.5 rounded-xl text-[14px] font-display font-semibold transition-colors duration-200 ${
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