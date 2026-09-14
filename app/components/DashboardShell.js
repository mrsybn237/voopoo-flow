"use client";

import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";

export default function DashboardShell({ searchItems, children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const hasSearch = Array.isArray(searchItems) && searchItems.length > 0;

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

  return (
    <>
      <Topbar onOpenPalette={hasSearch ? () => setPaletteOpen(true) : null} />
      {children}
      {paletteOpen && hasSearch && (
        <CommandPalette items={searchItems} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}