import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";
import Link from "next/link";

function hitungSelisihHari(tanggalISO) {
  const target = new Date(tanggalISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default async function KelolaEventPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("events")
    .select("*")
    .order("tanggal_mulai", { ascending: false });

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-display text-xl font-semibold text-text">Event</div>
          <Link href="/kelola-event/baru" className="bg-ember text-void font-semibold rounded-lg px-3.5 py-2 text-[12.5px] hover:glow-ember transition-shadow">
            + Tambah
          </Link>
        </div>

        {error && (
          <div className="bg-panel border border-line-soft rounded-[10px] p-4 text-ember text-[13px] mb-4">
            Gagal memuat data: {error.message}
          </div>
        )}

        {!error && (rows || []).length === 0 && (
          <div className="bg-panel border border-dashed border-line rounded-[10px] py-10 text-center text-[13px] text-muted-dim">
            Belum ada event terjadwal.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {(rows || []).map((ev) => {
            const mulaiDiff = hitungSelisihHari(ev.tanggal_mulai);
            const selesaiDiff = hitungSelisihHari(ev.tanggal_selesai);
            let statusLabel;
            if (mulaiDiff > 0) statusLabel = `H-${mulaiDiff}`;
            else if (selesaiDiff >= 0) statusLabel = "Berlangsung";
            else statusLabel = "Selesai";

            return (
              <Link
                key={ev.id}
                href={`/kelola-event/${ev.id}`}
                className="flex items-center gap-3 bg-panel border border-line-soft rounded-xl p-3.5 hover:border-ember/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] text-text truncate">{ev.nama_event}</div>
                  <div className="text-[11.5px] text-muted-dim mt-0.5">{ev.lokasi || "-"}</div>
                </div>
                <span className="font-mono text-[10.5px] text-muted-dim flex-shrink-0 px-2 py-1 rounded-full bg-panel-raised">
                  {statusLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}