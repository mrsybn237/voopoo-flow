import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";

function hitungSelisihHari(tanggalISO) {
  const target = new Date(tanggalISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default async function KelolaJadwalTalentPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("jadwal_talent")
    .select("*, talent_collab(nama_talent), lokasi_shooting(nama_lokasi)")
    .order("tanggal_mulai", { ascending: true });

  const jadwalList = data || [];

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-7">
          <div className="font-display text-xl font-semibold text-text">Jadwal Talent</div>
          <Link
            href="/kelola-jadwal-talent/baru"
            className="bg-ember text-void font-semibold rounded-lg px-4 py-2 text-[13px] hover:glow-ember transition-shadow"
          >
            + Tambah Jadwal
          </Link>
        </div>

        {jadwalList.length === 0 && (
          <div className="text-[13px] text-muted-dim py-10 text-center border border-dashed border-line rounded-[10px]">
            Belum ada jadwal talent. Klik &quot;+ Tambah Jadwal&quot; buat mulai.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {jadwalList.map((j) => {
            const mulaiDiff = hitungSelisihHari(j.tanggal_mulai);
            const selesaiDiff = j.tanggal_selesai ? hitungSelisihHari(j.tanggal_selesai) : mulaiDiff;
            let statusLabel;
            let isActive = false;

            if (mulaiDiff > 0) {
              statusLabel = `H-${mulaiDiff}`;
            } else if (selesaiDiff >= 0) {
              statusLabel = "Berlangsung";
              isActive = true;
            } else {
              statusLabel = "Selesai";
            }

            return (
              <Link
                key={j.id}
                href={`/kelola-jadwal-talent/${j.id}`}
                className={`block rounded-[10px] p-4 border transition-all duration-200 ${
                  isActive
                    ? "bg-ember-dim border-ember glow-ember"
                    : "bg-panel border-line-soft hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="text-[14px] text-text font-medium">
                    {j.talent_collab?.nama_talent || "Talent tidak ditemukan"}
                  </div>
                  <span className="font-mono text-[11px] text-ember flex-shrink-0">{statusLabel}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                  <span className="font-mono">
                    {new Date(j.tanggal_mulai + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    {j.tanggal_selesai && j.tanggal_selesai !== j.tanggal_mulai && (
                      <> – {new Date(j.tanggal_selesai + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</>
                    )}
                  </span>
                  {j.lokasi_shooting?.nama_lokasi && (
                    <>
                      <span>·</span>
                      <span>{j.lokasi_shooting.nama_lokasi}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}