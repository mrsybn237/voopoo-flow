"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const STATUS_OPTIONS = ["Brief", "Produksi", "Review", "Posting"];
const PILAR_OPTIONS = ["Education", "Entertainment", "Lifestyle", "Community", "Promotional", "Agile", "Product"];
const PRODUCT_OPTIONS = ["Argus Matrix", "Argus Z3", "Argus Link", "Lainnya"];
const PLATFORM_OPTIONS = ["IG @voopoo_indonesia", "IG @voopoo_daily", "TikTok @voopoo_indonesia"];
const PIC_OPTIONS = ["Han", "Designer", "Video Editor", "Lainnya"];
const JENIS_OPTIONS = ["Reels", "Carousel", "Single Post", "Story", "Video", "Live", "Lainnya"];

export default function ContentForm({ initialData = null }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    judul: initialData?.judul || "",
    status: initialData?.status || "Brief",
    jenis_konten: initialData?.jenis_konten || "Reels",
    pilar: initialData?.pilar || "Education",
    product: initialData?.product || "Argus Matrix",
    platform: initialData?.platform || "IG @voopoo_indonesia",
    pic: initialData?.pic || "Han",
    tanggal_produksi: initialData?.tanggal_produksi || "",
    tanggal_posting: initialData?.tanggal_posting || "",
    brief: initialData?.brief || "",
    views: initialData?.views ?? 0,
    link_aset: initialData?.link_aset || "",
    link_referensi: initialData?.link_referensi || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      views: Number(form.views) || 0,
      tanggal_produksi: form.tanggal_produksi || null,
      tanggal_posting: form.tanggal_posting || null,
    };

    let result;
    if (isEdit) {
      result = await supabase.from("content_plan").update(payload).eq("id", initialData.id);
    } else {
      result = await supabase.from("content_plan").insert(payload);
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Yakin mau hapus konten ini?")) return;
    setSaving(true);
    const result = await supabase.from("content_plan").delete().eq("id", initialData.id);
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px] mx-auto px-6 py-10">
      <div className="font-display text-lg font-semibold text-text mb-6">
        {isEdit ? "Edit Konten" : "Tambah Konten Baru"}
      </div>

      {error && (
        <div className="bg-ember-dim border border-ember text-ember text-[13px] rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Field label="Judul">
          <input
            type="text"
            value={form.judul}
            onChange={(e) => update("judul", e.target.value)}
            required
            className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text focus:border-ember outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Jenis Konten">
            <select
              value={form.jenis_konten}
              onChange={(e) => update("jenis_konten", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {JENIS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Pilar">
            <select
              value={form.pilar}
              onChange={(e) => update("pilar", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {PILAR_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Product">
            <select
              value={form.product}
              onChange={(e) => update("product", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {PRODUCT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Platform">
            <select
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {PLATFORM_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="PIC">
            <select
              value={form.pic}
              onChange={(e) => update("pic", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            >
              {PIC_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tanggal Produksi">
            <input
              type="date"
              value={form.tanggal_produksi}
              onChange={(e) => update("tanggal_produksi", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            />
          </Field>
          <Field label="Tanggal Posting">
            <input
              type="date"
              value={form.tanggal_posting}
              onChange={(e) => update("tanggal_posting", e.target.value)}
              className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
            />
          </Field>
        </div>

        <Field label="Brief">
          <textarea
            value={form.brief}
            onChange={(e) => update("brief", e.target.value)}
            rows={4}
            className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text focus:border-ember outline-none resize-none"
          />
        </Field>

        <Field label="Views">
          <input
            type="number"
            min="0"
            value={form.views}
            onChange={(e) => update("views", e.target.value)}
            className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text"
          />
        </Field>

        <Field label="Link Aset (hasil akhir)">
          <input
            type="url"
            value={form.link_aset}
            onChange={(e) => update("link_aset", e.target.value)}
            placeholder="https://..."
            className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text focus:border-ember outline-none"
          />
        </Field>

        <Field label="Link Referensi (inspirasi)">
          <input
            type="url"
            value={form.link_referensi}
            onChange={(e) => update("link_referensi", e.target.value)}
            placeholder="https://..."
            className="w-full bg-panel border border-line rounded-lg px-3 py-2.5 text-[14px] text-text focus:border-ember outline-none"
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 mt-7">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-ember text-void font-semibold rounded-lg px-4 py-2.5 text-[14px] disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Konten"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="bg-panel border border-line text-muted rounded-lg px-4 py-2.5 text-[14px] hover:text-text transition-colors"
        >
          Batal
        </button>
      </div>

      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving}
          className="w-full mt-3 text-ember text-[13px] py-2 hover:underline"
        >
          Hapus konten ini
        </button>
      )}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] text-muted">{label}</span>
      {children}
    </label>
  );
}