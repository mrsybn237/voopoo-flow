"use client";

import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";

export default function DashboardShell({ searchItems, children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <Topbar onOpenPalette={() => setPaletteOpen(true)} />
      {children}
      {paletteOpen && (
        <CommandPalette items={searchItems} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}