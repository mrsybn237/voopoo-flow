import Link from "next/link";

function hitungSelisihHari(tanggalISO) {
  const target = new Date(tanggalISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export default function TalentPanel({ talent }) {
  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Talent Collab</div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] text-muted-dim">{talent.length} talent</div>
          <Link
            href="/kelola-talent/baru"
            className="bg-ember-dim text-ember font-medium rounded-lg px-2.5 py-1 text-[11px] hover:glow-ember transition-shadow"
          >
            + Tambah
          </Link>
        </div>
      </div>

      {talent.length === 0 && (
        <div className="text-[13px] text-muted-dim py-4">Belum ada kolaborasi talent.</div>
      )}

      {talent.map((t) => {
        const diff = t.deadline ? hitungSelisihHari(t.deadline) : null;
        let deadlineColor = "text-muted-dim";
        let deadlineLabel = "-";
        if (diff !== null) {
          if (diff < 0) {
            deadlineColor = "text-ember";
            deadlineLabel = `Telat ${Math.abs(diff)} hari`;
          } else if (diff <= 3) {
            deadlineColor = "text-ember";
            deadlineLabel = diff === 0 ? "Hari ini" : `H-${diff}`;
          } else {
            deadlineLabel = new Date(t.deadline + "T00:00:00").toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            });
          }
        }

        return (
          <Link
            href={`/kelola-talent/${t.id}`}
            key={t.id}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-line-soft last:border-none hover:bg-panel-raised -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="min-w-0">
              <div className="text-[13.5px] text-text truncate">{t.nama_talent}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10.5px] text-muted-dim">{t.platform || "-"}</span>
                <span className="text-[10.5px] text-muted">·</span>
                <span className="text-[10.5px] text-muted">{t.status || "-"}</span>
              </div>
            </div>
            <span className={`font-mono text-[11px] flex-shrink-0 ${deadlineColor}`}>{deadlineLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}