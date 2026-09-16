import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";

const STATUS_STYLE = {
  Brief: "bg-ember-dim text-ember",
  Produksi: "bg-vapor-dim text-vapor",
  Selesai: "bg-panel-raised text-muted-dim",
};

export default async function KelolaTalentPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("talent_collab")
    .select("*")
    .order("deadline", { ascending: true });

  const talent = data || [];

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-7">
          <div className="font-display text-xl font-semibold text-text">Kelola Talent</div>
          <Link
            href="/kelola-talent/baru"
            className="bg-ember text-void font-semibold rounded-lg px-4 py-2 text-[13px] hover:glow-ember transition-shadow"
          >
            + Tambah Talent
          </Link>
        </div>

        {error && (
          <div className="bg-panel border border-line-soft rounded-[10px] p-4 text-ember text-[13px] mb-4">
            Gagal memuat data: {error.message}
          </div>
        )}

        {!error && talent.length === 0 && (
          <div className="text-[13px] text-muted-dim py-10 text-center border border-dashed border-line rounded-[10px]">
            Belum ada talent. Klik &quot;+ Tambah Talent&quot; buat mulai.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {talent.map((t) => (
            <Link
              key={t.id}
              href={`/kelola-talent/${t.id}`}
              className="flex items-center gap-3 bg-panel border border-line-soft rounded-[10px] p-4 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] text-text font-medium mb-1.5">{t.nama_talent}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                  <span>{t.platform || "-"}</span>
                  <span>·</span>
                  <span className="font-mono">
                    {t.deadline
                      ? new Date(t.deadline + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                      : "-"}
                  </span>
                </div>
              </div>
              <span className={`font-mono text-[10.5px] flex-shrink-0 px-2 py-1 rounded-full ${STATUS_STYLE[t.status] || STATUS_STYLE.Brief}`}>
                {t.status || "Brief"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}