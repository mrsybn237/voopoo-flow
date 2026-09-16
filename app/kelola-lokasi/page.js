import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";

export default async function KelolaLokasiPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("lokasi_shooting")
    .select("*")
    .order("nama_lokasi", { ascending: true });

  const lokasiList = data || [];

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-7">
          <div className="font-display text-xl font-semibold text-text">Kelola Lokasi Shooting</div>
          <Link
            href="/kelola-lokasi/baru"
            className="bg-ember text-void font-semibold rounded-lg px-4 py-2 text-[13px] hover:glow-ember transition-shadow"
          >
            + Tambah Lokasi
          </Link>
        </div>

        {lokasiList.length === 0 && (
          <div className="text-[13px] text-muted-dim py-10 text-center border border-dashed border-line rounded-[10px]">
            Belum ada lokasi. Klik &quot;+ Tambah Lokasi&quot; buat mulai.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {lokasiList.map((lok) => (
            <Link
              key={lok.id}
              href={`/kelola-lokasi/${lok.id}`}
              className="block bg-panel border border-line-soft rounded-[10px] p-4 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
            >
              <div className="text-[14px] text-text font-medium mb-1.5">{lok.nama_lokasi}</div>
              {lok.alamat && <div className="text-[12px] text-muted mb-1">{lok.alamat}</div>}
              {lok.keterangan && <div className="text-[12px] text-muted-dim line-clamp-1">{lok.keterangan}</div>}
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}