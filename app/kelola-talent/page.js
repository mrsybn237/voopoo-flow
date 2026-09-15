import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";

export default async function KelolaEventPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("*")
    .order("tanggal_mulai", { ascending: true });

  const events = data || [];

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-7">
          <div className="font-display text-xl font-semibold text-text">Kelola Event</div>
          <Link
            href="/kelola-event/baru"
            className="bg-ember text-void font-semibold rounded-lg px-4 py-2 text-[13px] hover:glow-ember transition-shadow"
          >
            + Tambah Event
          </Link>
        </div>

        {events.length === 0 && (
          <div className="text-[13px] text-muted-dim py-10 text-center border border-dashed border-line rounded-[10px]">
            Belum ada event. Klik &quot;+ Tambah Event&quot; buat mulai.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={`/kelola-event/${ev.id}`}
              className="block bg-panel border border-line-soft rounded-[10px] p-4 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
            >
              <div className="text-[14px] text-text font-medium mb-1.5">{ev.nama_event}</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted mb-1.5">
                <span>{ev.lokasi || "-"}</span>
                <span>·</span>
                <span className="font-mono">
                  {ev.tanggal_mulai
                    ? new Date(ev.tanggal_mulai + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                    : "-"}
                  {" – "}
                  {ev.tanggal_selesai
                    ? new Date(ev.tanggal_selesai + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                    : "-"}
                </span>
              </div>
              {ev.keterangan && <div className="text-[12px] text-muted-dim line-clamp-1">{ev.keterangan}</div>}
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}