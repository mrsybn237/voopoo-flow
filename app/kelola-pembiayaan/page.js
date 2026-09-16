import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";
import Link from "next/link";

const STATUS_STYLE = {
  Pending: "bg-ember-dim text-ember",
  Disetujui: "bg-vapor-dim text-vapor",
  Ditolak: "bg-panel-raised text-muted-dim",
};

export default async function KelolaPembiayaanPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("pembiayaan")
    .select("*")
    .order("tanggal", { ascending: false });

  const total = (rows || []).reduce((sum, r) => sum + (r.jumlah || 0), 0);

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-display text-xl font-semibold text-text">Pembiayaan</div>
          <Link href="/kelola-pembiayaan/baru" className="bg-ember text-void font-semibold rounded-lg px-3.5 py-2 text-[12.5px] hover:glow-ember transition-shadow">
            + Tambah
          </Link>
        </div>
        <div className="font-mono text-[12px] text-muted-dim mb-6">
          Total tercatat: Rp {total.toLocaleString("id-ID")}
        </div>

        {error && (
          <div className="bg-panel border border-line-soft rounded-[10px] p-4 text-ember text-[13px] mb-4">
            Gagal memuat data: {error.message}
          </div>
        )}

        {!error && (rows || []).length === 0 && (
          <div className="bg-panel border border-dashed border-line rounded-[10px] py-10 text-center text-[13px] text-muted-dim">
            Belum ada catatan pembiayaan.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {(rows || []).map((r) => (
            <Link
              key={r.id}
              href={`/kelola-pembiayaan/${r.id}`}
              className="flex items-center gap-3 bg-panel border border-line-soft rounded-xl p-3.5 hover:border-ember/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] text-text truncate">{r.kategori || r.jenis}</div>
                <div className="text-[11.5px] text-muted-dim mt-0.5">
                  {r.jenis} · {new Date(r.tanggal + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <span className="font-mono text-[12.5px] text-text flex-shrink-0">
                Rp {(r.jumlah || 0).toLocaleString("id-ID")}
              </span>
              <span className={`font-mono text-[10.5px] flex-shrink-0 px-2 py-1 rounded-full ${STATUS_STYLE[r.status] || STATUS_STYLE.Pending}`}>
                {r.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}