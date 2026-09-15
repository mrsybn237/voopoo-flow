import Link from "next/link";

function hitungSelisihHari(tanggalISO) {
  const target = new Date(tanggalISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default function EventPanel({ events }) {
  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Event</div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] text-muted-dim">{events.length} event</div>
          <Link
            href="/kelola-event/baru"
            className="bg-ember-dim text-ember font-medium rounded-full px-2.5 py-1 text-[11px] hover:glow-ember transition-shadow"
          >
            + Tambah
          </Link>
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-[13px] text-muted-dim py-4">Belum ada event terjadwal.</div>
      )}

      <div className="flex flex-col gap-2.5">
        {events.map((ev) => {
          const mulaiDiff = hitungSelisihHari(ev.tanggal_mulai);
          const selesaiDiff = hitungSelisihHari(ev.tanggal_selesai);
          let statusLabel;
          let isActive = false;
          let isSoon = false;

          if (mulaiDiff > 0) {
            statusLabel = `H-${mulaiDiff}`;
            isSoon = mulaiDiff <= 7;
          } else if (selesaiDiff >= 0) {
            statusLabel = "Berlangsung";
            isActive = true;
          } else {
            statusLabel = "Selesai";
          }

          return (
            <Link
              href={`/kelola-event/${ev.id}`}
              key={ev.id}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "bg-ember-dim border-ember glow-ember"
                  : "bg-panel-raised border-line-soft hover:border-ember/40 hover:-translate-y-0.5"
              }`}
            >
              <div
                className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${
                  isActive ? "bg-ember" : isSoon ? "bg-ember/60" : "bg-muted-dim"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] text-text truncate flex items-center gap-2">
                  {ev.nama_event}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ember pulse-dot flex-shrink-0" />}
                </div>
                <div className="text-[11.5px] text-muted mt-0.5">{ev.lokasi || "-"}</div>
              </div>
              <span
                className={`font-mono text-[11px] flex-shrink-0 px-2 py-1 rounded-full ${
                  isActive ? "text-ember" : isSoon ? "text-ember bg-ember-dim" : "text-muted-dim"
                }`}
              >
                {statusLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}