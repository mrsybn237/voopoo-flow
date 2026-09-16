"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function JadwalTalentForm({ initialData }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);

  const [talentList, setTalentList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);

  const [form, setForm] = useState({
    talent_id: initialData?.talent_id || "",
    lokasi_shooting_id: initialData?.lokasi_shooting_id || "",
    tanggal_mulai: initialData?.tanggal_mulai || "",
    tanggal_selesai: initialData?.tanggal_selesai || "",
    keterangan: initialData?.keterangan || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let aktif = true;
    async function ambilData() {
      const [talentRes, lokasiRes] = await Promise.all([
        supabase.from("talent_collab").select("id, nama_talent").order("nama_talent"),
        supabase.from("lokasi_shooting").select("id, nama_lokasi").order("nama_lokasi"),
      ]);
      if (aktif) {
        setTalentList(talentRes.data || []);
        setLokasiList(lokasiRes.data || []);
      }
    }
    ambilData();
    return () => {
      aktif = false;
    };
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      talent_id: form.talent_id || null,
      lokasi_shooting_id: form.lokasi_shooting_id || null,
      tanggal_mulai: form.tanggal_mulai || null,
      tanggal_selesai: form.tanggal_selesai || null,
      keterangan: form.keterangan,
    };

    const query = isEdit
      ? supabase.from("jadwal_talent").update(payload).eq("id", initialData.id)
      : supabase.from("jadwal_talent").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-jadwal-talent");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Hapus jadwal ini? Ini gak bisa dibatalkan.")) return;
    setDeleting(true);
    const { error } = await supabase.from("jadwal_talent").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-jadwal-talent");
    router.refresh();
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="font-display text-xl font-semibold text-text mb-7">
        {isEdit ? "Edit Jadwal Talent" : "Tambah Jadwal Talent"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Talent</span>
          <select
            required
            value={form.talent_id}
            onChange={(e) => update("talent_id", e.target.value)}
            className={inputClass}
          >
            <option value="">— Pilih talent —</option>
            {talentList.map((t) => (
              <option key={t.id} value={t.id}>{t.nama_talent}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Lokasi Shooting</span>
          <select
            value={form.lokasi_shooting_id}
            onChange={(e) => update("lokasi_shooting_id", e.target.value)}
            className={inputClass}
          >
            <option value="">— Belum ditentukan —</option>
            {lokasiList.map((lok) => (
              <option key={lok.id} value={lok.id}>{lok.nama_lokasi}</option>
            ))}
          </select>
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
              value={form.tanggal_selesai || ""}
              onChange={(e) => update("tanggal_selesai", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Keterangan</span>
          <textarea
            rows={4}
            value={form.keterangan}
            onChange={(e) => update("keterangan", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Kota, detail perjalanan, kontak lokal, dll..."
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
            onClick={() => router.push("/kelola-jadwal-talent")}
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
            {deleting ? "Menghapus..." : "Hapus jadwal ini"}
          </button>
        )}
      </form>
    </div>
  );
}