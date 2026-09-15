"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const PLATFORM_OPTIONS = ["IG @voopoo_indonesia", "IG @voopoo_daily", "TikTok @voopoo_indonesia"];
const STATUS_OPTIONS = ["Idea", "Brief", "In Progress", "Done"];

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function TalentForm({ initialData, contentOptions }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    nama_talent: initialData?.nama_talent || "",
    platform: initialData?.platform || PLATFORM_OPTIONS[0],
    status: initialData?.status || STATUS_OPTIONS[0],
    deadline: initialData?.deadline || "",
    brief: initialData?.brief || "",
    content_plan_id: initialData?.content_plan_id || "",
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
      nama_talent: form.nama_talent,
      platform: form.platform,
      status: form.status,
      deadline: form.deadline || null,
      brief: form.brief,
      content_plan_id: form.content_plan_id ? Number(form.content_plan_id) : null,
    };

    const query = isEdit
      ? supabase.from("talent_collab").update(payload).eq("id", initialData.id)
      : supabase.from("talent_collab").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-talent");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Hapus kolaborasi dengan "${form.nama_talent}"? Ini gak bisa dibatalkan.`)) return;
    setDeleting(true);
    const { error } = await supabase.from("talent_collab").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/kelola-talent");
    router.refresh();
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="font-display text-xl font-semibold text-text mb-7">
        {isEdit ? "Edit Talent/Partner" : "Tambah Talent/Partner"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Nama Talent/Partner</span>
          <input
            type="text"
            required
            value={form.nama_talent}
            onChange={(e) => update("nama_talent", e.target.value)}
            className={inputClass}
            placeholder="misal: Steam Queen"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Platform</span>
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

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Status</span>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Deadline</span>
          <input
            type="date"
            value={form.deadline || ""}
            onChange={(e) => update("deadline", e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Konten Terkait (opsional)</span>
          <select
            value={form.content_plan_id || ""}
            onChange={(e) => update("content_plan_id", e.target.value)}
            className={inputClass}
          >
            <option value="">— Tidak terkait konten manapun —</option>
            {contentOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.judul}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] text-muted font-medium">Brief</span>
          <textarea
            rows={5}
            value={form.brief}
            onChange={(e) => update("brief", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Detail brief buat talent ini..."
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
            onClick={() => router.push("/kelola-talent")}
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
            {deleting ? "Menghapus..." : "Hapus talent ini"}
          </button>
        )}
      </form>
    </div>
  );
}