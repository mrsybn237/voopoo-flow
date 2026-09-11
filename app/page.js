import { createClient } from "./lib/supabase-server";
import { toISODate, last6Months } from "./lib/dateUtils";
import DashboardShell from "./components/DashboardShell";
import AchievementRing from "./components/AchievementRing";
import TodayPanel from "./components/TodayPanel";
import WeekStrip from "./components/WeekStrip";
import KpiPanel from "./components/KpiPanel";
import ContentPipeline from "./components/ContentPipeline";
import TrendChart from "./components/TrendChart";
import EventPanel from "./components/EventPanel";
import TalentPanel from "./components/TalentPanel";

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function Home() {
  const supabase = await createClient();
  const today = new Date();
  const todayISO = toISODate(today);

  const monday = getMonday(today);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const mondayISO = toISODate(monday);
  const sundayISO = toISODate(sunday);

  const startOfMonth = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
  const endOfMonth = toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  const startOfNextMonth = toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 1));

  const months = last6Months(today);
  const rangeStart = months[0].start;
  const rangeEnd = months[months.length - 1].end;

  const [
    todayContentRes,
    todayTalentRes,
    weekContentRes,
    monthContentRes,
    kpiRes,
    allContentRes,
    trendContentRes,
    trendKpiRes,
    allTalentRes,
    eventsRes,
  ] = await Promise.all([
    supabase
      .from("content_plan")
      .select("*")
      .or(`tanggal_produksi.eq.${todayISO},tanggal_posting.eq.${todayISO}`),
    supabase.from("talent_collab").select("*").eq("deadline", todayISO),
    supabase
      .from("content_plan")
      .select("id, tanggal_posting")
      .gte("tanggal_posting", mondayISO)
      .lte("tanggal_posting", sundayISO),
    supabase
      .from("content_plan")
      .select("id, views")
      .gte("tanggal_posting", startOfMonth)
      .lte("tanggal_posting", endOfMonth),
    supabase
      .from("kpi_bulanan")
      .select("*")
      .gte("bulan", startOfMonth)
      .lt("bulan", startOfNextMonth)
      .maybeSingle(),
    supabase
      .from("content_plan")
      .select("*")
      .order("tanggal_posting", { ascending: true }),
    supabase
      .from("content_plan")
      .select("views, tanggal_posting")
      .gte("tanggal_posting", rangeStart)
      .lte("tanggal_posting", rangeEnd),
    supabase
      .from("kpi_bulanan")
      .select("bulan, target_views")
      .gte("bulan", rangeStart)
      .lt("bulan", startOfNextMonth),
    supabase
      .from("talent_collab")
      .select("*")
      .order("deadline", { ascending: true }),
    supabase
      .from("events")
      .select("*")
      .order("tanggal_mulai", { ascending: true }),
  ]);

  const todayContent = todayContentRes.data || [];
  const todayTalent = todayTalentRes.data || [];
  const weekContent = weekContentRes.data || [];
  const monthContent = monthContentRes.data || [];
  const kpi = kpiRes.data;
  const allContent = allContentRes.data || [];
  const trendContent = trendContentRes.data || [];
  const trendKpi = trendKpiRes.data || [];
  const allTalent = allTalentRes.data || [];
  const events = eventsRes.data || [];

  const totalViews = monthContent.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalKonten = monthContent.length;
  const targetViews = kpi?.target_views || 0;
  const targetKonten = kpi?.target_konten || 0;
  const achievementPct = targetViews > 0 ? Math.min(100, Math.round((totalViews / targetViews) * 100)) : 0;

  const trendData = months.map((m) => {
    const aktual = trendContent
      .filter((c) => c.tanggal_posting >= m.start && c.tanggal_posting <= m.end)
      .reduce((sum, c) => sum + (c.views || 0), 0);
    const kpiBulan = trendKpi.find((k) => k.bulan >= m.start && k.bulan <= m.end);
    return { label: m.label, aktual, target: kpiBulan?.target_views || 0 };
  });

  const searchItems = [
    { id: "nav-home", type: "Halaman", label: "Dashboard Utama", href: "/" },
    { id: "nav-tambah", type: "Halaman", label: "Tambah Konten Baru", href: "/tambah" },
    { id: "nav-meeting", type: "Halaman", label: "Ringkasan Meeting", href: "/meeting" },
    { id: "nav-panduan", type: "Halaman", label: "Panduan Penggunaan", href: "/panduan" },
    ...allContent.map((c) => ({
      id: `c-${c.id}`,
      type: c.pilar || "Konten",
      label: c.judul,
      href: `/tambah/${c.id}`,
    })),
    ...allTalent.map((t) => ({
      id: `t-${t.id}`,
      type: "Talent",
      label: `${t.nama_talent} — ${t.platform || ""}`,
      href: `/talent/${t.id}`,
    })),
  ];

  return (
    <DashboardShell searchItems={searchItems}>
      <div className="max-w-[1180px] mx-auto px-6 pt-7 pb-16">
        <AchievementRing
          achievementPct={achievementPct}
          totalKonten={totalKonten}
          targetKonten={targetKonten}
          todayDone={0}
          todayTotal={todayContent.length + todayTalent.length}
        />
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
          <TodayPanel content={todayContent} talent={todayTalent} />
          <WeekStrip weekContent={weekContent} monday={mondayISO} todayISO={todayISO} />
          <div className="md:col-span-2">
            <KpiPanel totalViews={totalViews} achievementPct={achievementPct} targetViews={targetViews} />
          </div>
        </div>
        <TrendChart data={trendData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EventPanel events={events} />
          <TalentPanel talent={allTalent} />
        </div>
        <ContentPipeline content={allContent} />
      </div>
    </DashboardShell>
  );
}