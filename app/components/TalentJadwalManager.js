"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const PLATFORM_OPTIONS = ["IG @voopoo_indonesia", "IG @voopoo_daily", "TikTok @voopoo_indonesia"];

const inputClass =
  "bg-panel border border-line rounded-lg px-2.5 py-2 text-[12.5px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function TalentJadwalManager({ talentCollabId, jadwalList, lokasiOptions }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    tanggal: "",
    lokasi_shooting_id: "",
    platform: PLATFORM_OPTIONS[0],
    keterangan: "",
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase.from("talent_jadwal").insert({
      talent_collab_id: talentCollabId,
      tanggal: form.tanggal,
      lokasi_shooting_id: form.lokasi_shooting_id ? Number(form.lokasi_shooting_id) : null,
      platform: form.platform,
      keterangan: form.keterangan,
    });

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setForm({ tanggal: "", lokasi_shooting_id: "", platform: PLATFORM_OPTIONS[0], keterangan: "" });
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus jadwal ini?")) return;
    await supabase.from("talent_jadwal").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="mt-8 pt-6 border-t border-line-soft">
      <div className="font-display text-[15px] font-semibold text-text mb-4">
        Jadwal Shooting ({jadwalList.length})
      </div>

      {jadwalList.length === 0 && (
        <div className="text-[12.5px] text-muted-dim mb-5">Belum ada jadwal buat talent ini.</div>
      )}

      <div className="flex flex-col gap-2 mb-6">
        {jadwalList.map((j) => (
          <div
            key={j.id}
            className="flex items-center justify-between gap-3 bg-panel-raised border border-line-soft rounded-lg px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <div className="text-[13px] text-text flex items-center gap-2 flex-wrap">
                <span className="font-mono text-ember">
                  {new Date(j.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-muted-dim">·</span>
                <span>{j.lokasi_shooting?.nama_lokasi || "Lokasi belum diisi"}</span>
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                {j.platform} {j.keterangan && `· ${j.keterangan}`}
              </div>
            </div>
            <button
              onClick={() => handleDelete(j.id)}
              className="text-muted-dim hover:text-ember transition-colors text-[11.5px] flex-shrink-0"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 bg-panel border border-line-soft rounded-xl p-4">
        <label className="flex flex-col gap-1 col-span-1">
          <span className="text-[11px] text-muted">Tanggal</span>
          <input
            type="date"
            required
            value={form.tanggal}
            onChange={(e) => update("tanggal", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 col-span-1">
          <span className="text-[11px] text-muted">Lokasi</span>
          <select
            value={form.lokasi_shooting_id}
            onChange={(e) => update("lokasi_shooting_id", e.target.value)}
            className={inputClass}
          >
            <option value="">— Belum ada —</option>
            {lokasiOptions.map((l) => (
              <option key={l.id} value={l.id}>{l.nama_lokasi}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 col-span-1">
          <span className="text-[11px] text-muted">Platform</span>
          <select
            value={form.platform}
            onChange={(e) => update("platform", e.target.value)}
            className={inputClass}
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 col-span-1">
          <span className="text-[11px] text-muted">Keterangan</span>
          <input
            type="text"
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
            className={inputClass}
            placeholder="misal: hari 1, outdoor"
          />
        </label>

        {errorMsg && (
          <div className="col-span-2 text-[11.5px] text-ember bg-ember-dim border border-ember/40 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="col-span-2 bg-ember-dim text-ember font-medium rounded-lg py-2 text-[12.5px] hover:glow-ember transition-shadow disabled:opacity-50"
        >
          {saving ? "Menambahkan..." : "+ Tambah Jadwal"}
        </button>
      </form>
    </div>
  );
}