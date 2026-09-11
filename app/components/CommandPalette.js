"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CommandPalette({ items, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, items]);

  function handleSelect(item) {
    if (item.href) {
      router.push(item.href);
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center pt-[12vh] z-50"
      onClick={onClose}
    >
      <div
        className="bg-panel border border-line rounded-xl w-full max-w-[480px] mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari konten, talent, atau halaman..."
          className="w-full bg-transparent px-4 py-3.5 text-[14px] text-text placeholder:text-muted-dim outline-none border-b border-line-soft"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-muted-dim">Gak ketemu.</div>
          )}
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-panel-raised transition-colors"
            >
              <span className="text-[13.5px] text-text truncate">{item.label}</span>
              <span className="font-mono text-[10.5px] text-muted-dim flex-shrink-0 ml-3">{item.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}