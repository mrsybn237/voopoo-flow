"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function EventForm({ initialData }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    nama_event: initialData?.nama_event || "",
    lokasi: initialData?.lokasi || "",
    tanggal_mulai: initialData?.tanggal_mulai || "",
    tanggal_selesai: initialData?.tanggal_selesai || "",
    keterangan: initialData?.keterangan || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      nama_event: form.nama_event,
      lokasi: form.lokasi,
      tanggal_mulai: form.tanggal_mulai || null,
      tanggal_selesai: form.tanggal_selesai || null,
      keterangan: form.keterangan,
    };

    const query = isEdit
      ? supabase.from("events").update(payload).eq("id", initialData.id)
      : supabase.from("events").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-event");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Hapus event "${form.nama_event}"? Ini gak bisa dibatalkan.`)) return;
    setDeleting(true);
    const { error } = await supabase.from("events").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-event");
    router.refresh();
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="font-display text-xl font-semibold text-text mb-7">
        {isEdit ? "Edit Event" : "Tambah Event"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Nama Event</span>
          <input
            type="text"
            required
            value={form.nama_event}
            onChange={(e) => update("nama_event", e.target.value)}
            className={inputClass}
            placeholder="misal: JIVE 2026"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Lokasi</span>
          <input
            type="text"
            value={form.lokasi}
            onChange={(e) => update("lokasi", e.target.value)}
            className={inputClass}
            placeholder="misal: JIExpo Kemayoran, Jakarta"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-muted font-medium">Tanggal Mulai</span>
            <input
              type="date"
              required
              value={form.tanggal_mulai || ""}
              onChange={(e) => update("tanggal_mulai", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-muted font-medium">Tanggal Selesai</span>
            <input
              type="date"
              required
              value={form.tanggal_selesai || ""}
              onChange={(e) => update("tanggal_selesai", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Keterangan</span>
          <textarea
            rows={5}
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Detail event, booth, agenda, dll..."
          />
        </label>

        {errorMsg && (
          <div className="text-[12.5px] text-ember bg-ember-dim border border-ember/40 rounded-lg px-3 py-2.5">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-ember text-void font-semibold rounded-lg px-5 py-2.5 text-[13.5px] hover:glow-ember transition-shadow disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/kelola-event")}
            className="text-muted text-[13.5px] hover:text-text transition-colors"
          >
            Batal
          </button>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-2 self-start text-[12.5px] text-muted-dim hover:text-ember transition-colors disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Hapus event ini"}
          </button>
        )}
      </form>
    </div>
  );
}