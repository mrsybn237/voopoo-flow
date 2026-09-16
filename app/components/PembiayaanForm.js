"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function PembiayaanForm({ initialData }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    jenis: initialData?.jenis || "Reimbursement",
    kategori: initialData?.kategori || "",
    jumlah: initialData?.jumlah || "",
    tanggal: initialData?.tanggal || "",
    keterangan: initialData?.keterangan || "",
    status: initialData?.status || "Pending",
  });
  const [file, setFile] = useState(null);
  const [existingBuktiUrl, setExistingBuktiUrl] = useState(initialData?.bukti_url || "");
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

    let buktiUrl = existingBuktiUrl;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("bukti-pembiayaan")
        .upload(path, file);

      if (uploadError) {
        setSaving(false);
        setErrorMsg(`Gagal upload bukti: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("bukti-pembiayaan")
        .getPublicUrl(path);
      buktiUrl = publicUrlData.publicUrl;
    }

    const payload = {
      jenis: form.jenis,
      kategori: form.kategori,
      jumlah: Number(form.jumlah) || 0,
      tanggal: form.tanggal || null,
      keterangan: form.keterangan,
      status: form.status,
      bukti_url: buktiUrl || null,
    };

    const query = isEdit
      ? supabase.from("pembiayaan").update(payload).eq("id", initialData.id)
      : supabase.from("pembiayaan").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-pembiayaan");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Hapus catatan pembiayaan ini? Ini gak bisa dibatalkan.`)) return;
    setDeleting(true);
    const { error } = await supabase.from("pembiayaan").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-pembiayaan");
    router.refresh();
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="font-display text-xl font-semibold text-text mb-7">
        {isEdit ? "Edit Pembiayaan" : "Tambah Pembiayaan"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Jenis</span>
          <select value={form.jenis} onChange={(e) => update("jenis", e.target.value)} className={inputClass}>
            <option value="Reimbursement">Reimbursement</option>
            <option value="Ads">Ads</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Kategori</span>
          <input type="text" value={form.kategori} onChange={(e) => update("kategori", e.target.value)} className={inputClass} placeholder="misal: Transport, Boost IG, dll" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-muted font-medium">Jumlah (Rp)</span>
            <input type="number" required value={form.jumlah} onChange={(e) => update("jumlah", e.target.value)} className={inputClass} placeholder="0" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] text-muted font-medium">Tanggal</span>
            <input type="date" required value={form.tanggal || ""} onChange={(e) => update("tanggal", e.target.value)} className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Status</span>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
            <option value="Pending">Pending</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Keterangan</span>
          <textarea rows={4} value={form.keterangan} onChange={(e) => update("keterangan", e.target.value)} className={`${inputClass} resize-none`} placeholder="Detail pengeluaran..." />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Bukti (screenshot)</span>
          {existingBuktiUrl && !file && (
            <a href={existingBuktiUrl} target="_blank" rel="noreferrer" className="text-[12px] text-ember hover:underline mb-1">
              Lihat bukti yang sudah diupload
            </a>
          )}
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[12.5px] text-muted" />
        </label>

        {errorMsg && (
          <div className="text-[12.5px] text-ember bg-ember-dim border border-ember/40 rounded-lg px-3 py-2.5">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="bg-ember text-void font-semibold rounded-lg px-5 py-2.5 text-[13.5px] hover:glow-ember transition-shadow disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" onClick={() => router.push("/kelola-pembiayaan")} className="text-muted text-[13.5px] hover:text-text transition-colors">
            Batal
          </button>
        </div>

        {isEdit && (
          <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 self-start text-[12.5px] text-muted-dim hover:text-ember transition-colors disabled:opacity-50">
            {deleting ? "Menghapus..." : "Hapus catatan ini"}
          </button>
        )}
      </form>
    </div>
  );
}