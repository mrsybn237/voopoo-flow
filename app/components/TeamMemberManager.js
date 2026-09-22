"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase-browser";

const inputClass =
  "bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-muted-dim focus:border-ember outline-none transition-colors";

export default function TeamMemberManager({ members }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ nama: "", username: "", email: "", role: "", is_admin: false });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase.from("team_members").insert({
      nama: form.nama,
      username: form.username,
      email: form.email.trim().toLowerCase(),
      role: form.role,
      is_admin: form.is_admin,
    });

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setForm({ nama: "", username: "", email: "", role: "", is_admin: false });
    router.refresh();
  }

  async function handleDelete(id, nama) {
    if (!confirm(`Hapus akses "${nama}"? Dia gak akan bisa login lagi setelah ini.`)) return;
    await supabase.from("team_members").delete().eq("id", id);
    router.refresh();
  }

  function startEdit(m) {
    setEditingId(m.id);
    setEditForm({ nama: m.nama, username: m.username || "", role: m.role, is_admin: m.is_admin });
  }

  async function saveEdit(id) {
    await supabase.from("team_members").update(editForm).eq("id", id);
    setEditingId(null);
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 bg-panel border border-line-soft rounded-xl p-5 mb-8">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted">Nama</span>
          <input required value={form.nama} onChange={(e) => update("nama", e.target.value)} className={inputClass} placeholder="Nama lengkap" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted">Username</span>
          <input required value={form.username} onChange={(e) => update("username", e.target.value)} className={inputClass} placeholder="misal: designer_voopoo" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted">Email Google</span>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="email@gmail.com" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted">Role</span>
          <input required value={form.role} onChange={(e) => update("role", e.target.value)} className={inputClass} placeholder="misal: Designer" />
        </label>
        <label className="flex items-center gap-2 col-span-2 mt-1">
          <input type="checkbox" checked={form.is_admin} onChange={(e) => update("is_admin", e.target.checked)} className="accent-ember" />
          <span className="text-[12.5px] text-muted">Jadikan admin (akses penuh ke dashboard)</span>
        </label>

        {errorMsg && (
          <div className="col-span-2 text-[12px] text-ember bg-ember-dim border border-ember/40 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="col-span-2 bg-ember text-void font-semibold rounded-lg py-2.5 text-[13.5px] hover:glow-ember transition-shadow disabled:opacity-50 press-effect"
        >
          {saving ? "Mendaftarkan..." : "+ Daftarkan Orang Baru"}
        </button>
      </form>

      <div className="flex flex-col gap-2.5">
        {members.map((m) => (
          <div key={m.id} className="bg-panel border border-line-soft rounded-[10px] p-4">
            {editingId === m.id ? (
              <div className="flex flex-col gap-2.5">
                <input
                  value={editForm.nama}
                  onChange={(e) => setEditForm((f) => ({ ...f, nama: e.target.value }))}
                  className={inputClass}
                />
                <input
                  value={editForm.username}
                  onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                  className={inputClass}
                />
                <input
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  className={inputClass}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.is_admin}
                    onChange={(e) => setEditForm((f) => ({ ...f, is_admin: e.target.checked }))}
                    className="accent-ember"
                  />
                  <span className="text-[12.5px] text-muted">Admin</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(m.id)} className="text-ember text-[12.5px] press-effect">Simpan</button>
                  <button onClick={() => setEditingId(null)} className="text-muted text-[12.5px] press-effect">Batal</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[14px] text-text font-medium flex items-center gap-2">
                    {m.nama}
                    {m.is_admin && (
                      <span className="font-mono text-[10px] text-ember bg-ember-dim px-2 py-0.5 rounded-full">ADMIN</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-muted mt-0.5">
                    @{m.username} · {m.email} · {m.role}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => startEdit(m)} className="text-muted hover:text-text text-[12.5px] press-effect">Edit</button>
                  <button onClick={() => handleDelete(m.id, m.nama)} className="text-muted-dim hover:text-ember text-[12.5px] press-effect">Hapus</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}