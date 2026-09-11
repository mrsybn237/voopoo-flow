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
        <div className="font-mono text-[11px] text-muted-dim">{events.length} event</div>
      </div>

      {events.length === 0 && (
        <div className="text-[13px] text-muted-dim py-4">Belum ada event terjadwal.</div>
      )}

      {events.map((ev) => {
        const mulaiDiff = hitungSelisihHari(ev.tanggal_mulai);
        const selesaiDiff = hitungSelisihHari(ev.tanggal_selesai);
        let statusLabel;
        let isActive = false;

        if (mulaiDiff > 0) {
          statusLabel = `H-${mulaiDiff}`;
        } else if (selesaiDiff >= 0) {
          statusLabel = "Berlangsung";
          isActive = true;
        } else {
          statusLabel = "Selesai";
        }

        return (
          <div
            key={ev.id}
            className={`flex items-start justify-between gap-3 py-2.5 border-b border-line-soft last:border-none ${
              isActive ? "bg-ember-dim -mx-2 px-2 rounded-lg" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="text-[13.5px] text-text truncate">{ev.nama_event}</div>
              <div className="text-[11.5px] text-muted mt-0.5">{ev.lokasi || "-"}</div>
            </div>
            <span
              className={`font-mono text-[11px] flex-shrink-0 ${
                isActive ? "text-ember" : mulaiDiff > 0 && mulaiDiff <= 7 ? "text-ember" : "text-muted-dim"
              }`}
            >
              {statusLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}