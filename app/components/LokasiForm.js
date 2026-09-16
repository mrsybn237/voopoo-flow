"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function LokasiForm({ initialData }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    nama_lokasi: initialData?.nama_lokasi || "",
    alamat: initialData?.alamat || "",
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
      nama_lokasi: form.nama_lokasi,
      alamat: form.alamat,
      keterangan: form.keterangan,
    };

    const query = isEdit
      ? supabase.from("lokasi_shooting").update(payload).eq("id", initialData.id)
      : supabase.from("lokasi_shooting").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-lokasi");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Hapus lokasi "${form.nama_lokasi}"? Ini gak bisa dibatalkan.`)) return;
    setDeleting(true);
    const { error } = await supabase.from("lokasi_shooting").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-lokasi");
    router.refresh();
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="font-display text-xl font-semibold text-text mb-7">
        {isEdit ? "Edit Lokasi" : "Tambah Lokasi"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Nama Lokasi</span>
          <input
            type="text"
            required
            value={form.nama_lokasi}
            onChange={(e) => update("nama_lokasi", e.target.value)}
            className={inputClass}
            placeholder="misal: Studio VOOPOO HQ"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Alamat</span>
          <input
            type="text"
            value={form.alamat}
            onChange={(e) => update("alamat", e.target.value)}
            className={inputClass}
            placeholder="misal: Jl. Sudirman No. 1, Jakarta"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Keterangan</span>
          <textarea
            rows={4}
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Akses parkir, kontak PIC lokasi, dll..."
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
            onClick={() => router.push("/kelola-lokasi")}
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
            {deleting ? "Menghapus..." : "Hapus lokasi ini"}
          </button>
        )}
      </form>
    </div>
  );
}