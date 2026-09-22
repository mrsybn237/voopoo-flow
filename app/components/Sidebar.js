"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <path d="M4 11.5L12 4l8 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h3v-5a2 2 0 012-2h0a2 2 0 012 2v5h3a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconCalendar({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconPeople({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 20c0-3.2 2.6-5.5 5.5-5.5s5.5 2.3 5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.5 15c2.4.3 4 2.2 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconFlag({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <path d="M6 3v18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 4.5c2-1.3 4-1.3 6 0s4 1.3 6 0v8c-2 1.3-4 1.3-6 0s-4-1.3-6 0v-8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function IconBook({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={className}>
      <path d="M4 5.5c2.2-1.3 5-1.3 8 0v14c-3-1.3-5.8-1.3-8 0v-14z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M20 5.5c-2.2-1.3-5-1.3-8 0v14c3-1.3 5.8-1.3 8 0v-14z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function IconGear({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019 9c.36.13.68.36.93.66"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLogout({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" className={className}>
      <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15 16l4-4-4-4M19 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ADMIN_ITEMS = [
  { href: "/", label: "Dashboard", Icon: IconHome },
  { href: "/saya", label: "Saya", Icon: IconUser },
  { href: "/meeting", label: "Meeting", Icon: IconCalendar },
  { href: "/tambah", label: "Tambah", Icon: IconPlus },
  { href: "/kelola-talent", label: "Talent", Icon: IconPeople },
  { href: "/kelola-event", label: "Event", Icon: IconFlag },
  { href: "/panduan", label: "Panduan", Icon: IconBook },
];

const MEMBER_ITEMS = [
  { href: "/saya", label: "Saya", Icon: IconUser },
  { href: "/panduan", label: "Panduan", Icon: IconBook },
];

export default function Sidebar({ me, onLogout }) {
  const pathname = usePathname();
  const items = me?.is_admin ? ADMIN_ITEMS : MEMBER_ITEMS;

  return (
    <div className="fixed left-0 top-0 h-full w-[84px] bg-panel border-r border-line-soft flex-col items-center py-5 z-40 hidden sm:flex">
      <Link href="/" className="relative w-11 h-11 mb-8 flex-shrink-0 group">
        <span className="absolute inset-0 rounded-full bg-ember/20 blur-md group-hover:bg-ember/35 transition-colors" />
        <img src="/logo-icon.png" alt="VOOPOO" className="relative w-full h-full object-contain p-1" />
      </Link>

      <div className="flex flex-col items-center gap-2 flex-1">
        {items.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 press-effect ${
                isActive ? "bg-ember-dim text-ember glow-ember" : "text-muted-dim hover:text-text hover:bg-panel-raised"
              }`}
            >
              <item.Icon className="transition-transform duration-200 group-hover:scale-110" />
              {isActive && <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-ember" />}
              <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-panel-raised border border-line-soft text-text text-[12px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 scale-95 origin-left transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2">
        {me?.is_admin && (
          <Link
            href="/admin/kelola-tim"
            title="Kelola Tim"
            className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 press-effect ${
              pathname.startsWith("/admin") ? "bg-ember-dim text-ember glow-ember" : "text-muted-dim hover:text-text hover:bg-panel-raised"
            }`}
          >
            <IconGear />
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-panel-raised border border-line-soft text-text text-[12px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 scale-95 origin-left transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 z-50">
              Kelola Tim
            </span>
          </Link>
        )}
        <button
          onClick={onLogout}
          title="Keluar"
          className="group relative w-12 h-12 flex items-center justify-center rounded-xl text-muted-dim hover:text-ember hover:bg-panel-raised transition-all duration-200 press-effect"
        >
          <IconLogout />
          <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-panel-raised border border-line-soft text-text text-[12px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 scale-95 origin-left transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 z-50">
            Keluar
          </span>
        </button>
      </div>
    </div>
  );
}