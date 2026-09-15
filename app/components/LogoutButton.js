"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="group bg-panel border border-line text-muted px-3.5 py-2.5 rounded-xl text-[13px] flex items-center gap-2 transition-all duration-200 hover:border-ember hover:text-text hover:glow-ember"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className="text-muted-dim group-hover:text-ember transition-colors">
        <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 16l4-4-4-4M19 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Keluar
    </button>
  );
}