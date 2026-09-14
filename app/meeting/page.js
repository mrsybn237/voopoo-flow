import { createClient } from "../lib/supabase-server";
import { toISODate } from "../lib/dateUtils";
import DashboardShell from "../components/DashboardShell";

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function MeetingPage({ searchParams }) {
  const params = await searchParams;
  const range = params?.range === "month" ? "month" : "week";

  const supabase = await createClient();
  const today = new Date();

  let start, end, label;

  if (range === "month") {
    start = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
    end = toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    label = today.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  } else {
    const monday = getMonday(today);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    start = toISODate(monday);
    end = toISODate(sunday);
    label = `${monday.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
  }

  const { data } = await supabase
    .from("content_plan")
    .select("*")
    .gte("tanggal_posting", start)
    .lte("tanggal_posting", end)
    .order("tanggal_posting", { ascending: true });

  const content = data || [];
  const totalViews = content.reduce((sum, c) => sum + (c.views || 0), 0);

  return (
    <DashboardShell>
      <div className="max-w-[900px] mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-display text-xl font-semibold text-text">Ringkasan Meeting</div>
          <div className="flex gap-2">
            
              href="/meeting?range=week"
              className={`text-[12.5px] px-3 py-1.5 rounded-lg border transition-colors ${range === "week" ? "border-ember text-ember glow-ember" : "border-line text-muted hover:text-text"}`}
            >
              Mingguan
            </a>
            
              href="/meeting?range=month"
              className={`text-[12.5px] px-3 py-1.5 rounded-lg border transition-colors ${range === "month" ? "border-ember text-ember glow-ember" : "border-line text-muted hover:text-text"}`}
            >
              Bulanan
            </a>
          </div>
        </div>
        <div className="font-mono text-[12px] text-muted-dim mb-6">{label}</div>

        <div className="grid grid-cols-2 gap-3 mb-7">
          <div className="bg-panel border border-line-soft rounded-[10px] p-4">
            <div className="text-[11.5px] text-muted mb-1">Total Konten</div>
            <div className="font-display text-2xl font-bold text-text">{content.length}</div>
          </div>
          <div className="bg-panel border border-line-soft rounded-[10px] p-4">
            <div className="text-[11.5px] text-muted mb-1">Total Views</div>
            <div className="font-display text-2xl font-bold text-ember">
              {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews}
            </div>
          </div>
        </div>

        {content.length === 0 && (
          <div className="text-[13px] text-muted-dim py-8 text-center border border-dashed border-line rounded-[10px]">
            Belum ada konten posting di rentang ini.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {content.map((c) => (
            <div key={c.id} className="bg-panel border border-line-soft rounded-[10px] p-4 transition-all hover:border-vapor/40 hover:glow-vapor">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[14px] text-text font-medium">{c.judul}</div>
                <span className="font-mono text-[11px] text-muted-dim flex-shrink-0">
                  {c.tanggal_posting
                    ? new Date(c.tanggal_posting + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                    : "-"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted mb-2">
                <span>{c.pilar || "-"}</span>
                <span>·</span>
                <span>{c.platform || "-"}</span>
                <span>·</span>
                <span>{c.status || "-"}</span>
                <span>·</span>
                <span className="text-ember font-mono">{(c.views || 0).toLocaleString("id-ID")} views</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[12px]">
                {c.link_referensi && (
                  <a href={c.link_referensi} target="_blank" rel="noopener noreferrer" className="text-vapor hover:underline">
                    Link Referensi ↗
                  </a>
                )}
                {c.link_aset && (
                  <a href={c.link_aset} target="_blank" rel="noopener noreferrer" className="text-vapor hover:underline">
                    Link Aset ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}