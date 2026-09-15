import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import DashboardShell from "../components/DashboardShell";

const STATUS_COLOR = {
  Idea: "text-muted",
  Brief: "text-vapor",
  "In Progress": "text-ember",
  Done: "text-text",
};

export default async function KelolaTalentPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("talent_collab")
    .select("*, content_plan(judul)")
    .order("deadline", { ascending: true });

  const talent = data || [];

  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-7">
          <div className="font-display text-xl font-semibold text-text">Kelola Talent & Partner</div>
          <Link
            href="/kelola-talent/baru"
            className="bg-ember text-void font-semibold rounded-lg px-4 py-2 text-[13px] hover:glow-ember transition-shadow"
          >
            + Tambah Talent
          </Link>
        </div>

        {talent.length === 0 && (
          <div className="text-[13px] text-muted-dim py-10 text-center border border-dashed border-line rounded-[10px]">
            Belum ada talent/partner. Klik &quot;+ Tambah Talent&quot; buat mulai.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {talent.map((t) => (
            <Link
              key={t.id}
              href={`/kelola-talent/${t.id}`}
              className="block bg-panel border border-line-soft rounded-[10px] p-4 transition-all duration-200 hover:border-ember hover:-translate-y-0.5 hover:glow-ember"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[14px] text-text font-medium">{t.nama_talent}</div>
                <span className={`font-mono text-[11px] flex-shrink-0 ${STATUS_COLOR[t.status] || "text-muted-dim"}`}>
                  {t.status || "-"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted mb-1.5">
                <span>{t.platform || "-"}</span>
                {t.deadline && (
                  <>
                    <span>·</span>
                    <span className="font-mono">
                      {new Date(t.deadline + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </>
                )}
                {t.content_plan?.judul && (
                  <>
                    <span>·</span>
                    <span>terkait: {t.content_plan.judul}</span>
                  </>
                )}
              </div>
              {t.brief && <div className="text-[12px] text-muted-dim line-clamp-1">{t.brief}</div>}
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}