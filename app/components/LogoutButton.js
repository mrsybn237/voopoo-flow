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
      className="bg-panel border border-line text-muted px-3 py-1.5 rounded-lg text-[13px] hover:border-ember hover:text-text transition-colors"
    >
      Keluar
    </button>
  );
}