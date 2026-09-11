import { toISODate } from "../lib/dateUtils";

const HARI_SINGKAT = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

export default function WeekStrip({ weekContent, monday, todayISO }) {
  const start = new Date(monday + "T00:00:00");

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = toISODate(d);
    const count = weekContent.filter((c) => c.tanggal_posting === iso).length;
    return { date: d, iso, count, isToday: iso === todayISO };
  });

  const weekNum = Math.ceil(start.getDate() / 7);

  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Minggu Ini</div>
        <div className="font-mono text-[11px] text-muted-dim">Minggu {weekNum}</div>
      </div>
      <div className="flex justify-between gap-1.5">
        {days.map((day) => (
          <div
            key={day.iso}
            className={`flex-1 flex flex-col items-center gap-2 py-2.5 px-1 rounded-lg ${
              day.isToday ? "bg-ember-dim border border-ember" : ""
            }`}
          >
            <div className="text-[10.5px] text-muted font-mono">{HARI_SINGKAT[day.date.getDay()]}</div>
            <div className="text-sm font-semibold font-display">{day.date.getDate()}</div>
            <div className="flex gap-0.5 items-end h-5">
              {Array.from({ length: Math.min(day.count, 4) }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-sm ${day.isToday ? "bg-ember" : "bg-vapor"}`}
                  style={{ height: `${8 + i * 4}px` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}