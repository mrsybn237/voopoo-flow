"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { createClient } from "../lib/supabase-browser";

export default function DashboardShell({ searchItems, children }) {
  const router = useRouter();
  const supabase = createClient();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [me, setMe] = useState(null);
  const hasSearch = Array.isArray(searchItems) && searchItems.length > 0;

  useEffect(() => {
    let aktif = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("team_members")
        .select("nama, role, is_admin")
        .eq("email", user.email)
        .maybeSingle();
      if (aktif) setMe(data);
    });
    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    if (!hasSearch) return;
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasSearch]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, []);

  return (
    <>
      <Sidebar me={me} onLogout={handleLogout} />
      <div className="sm:ml-[84px]">
        <Topbar onOpenPalette={hasSearch ? () => setPaletteOpen(true) : null} me={me} />
        {children}
      </div>
      {paletteOpen && hasSearch && (
        <CommandPalette items={searchItems} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}