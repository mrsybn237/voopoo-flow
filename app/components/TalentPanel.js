import Link from "next/link";

function hitungSelisihHari(tanggalISO) {
  const target = new Date(tanggalISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const STATUS_DOT = {
  Idea: "bg-muted-dim",
  Brief: "bg-vapor",
  "In Progress": "bg-ember",
  Done: "bg-text",
};

export default function TalentPanel({ talent }) {
  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Talent Collab</div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] text-muted-dim">{talent.length} talent</div>
          <Link
            href="/kelola-talent/baru"
            className="bg-ember-dim text-ember font-medium rounded-full px-2.5 py-1 text-[11px] hover:glow-ember transition-shadow"
          >
            + Tambah
          </Link>
        </div>
      </div>

      {talent.length === 0 && (
        <div className="text-[13px] text-muted-dim py-4">Belum ada kolaborasi talent.</div>
      )}

      <div className="flex flex-col gap-2">
        {talent.map((t) => {
          const diff = t.deadline ? hitungSelisihHari(t.deadline) : null;
          let deadlineColor = "text-text bg-panel";
          let deadlineLabel = "-";
          if (diff !== null) {
            if (diff < 0) {
              deadlineColor = "text-ember bg-ember-dim";
              deadlineLabel = `Telat ${Math.abs(diff)} hari`;
            } else if (diff <= 3) {
              deadlineColor = "text-ember bg-ember-dim";
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
              className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-ember/40 hover:bg-panel-raised hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="relative w-9 h-9 rounded-full bg-panel-raised border border-line-soft flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[11px] text-ember font-semibold">{initials(t.nama_talent)}</span>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-panel ${STATUS_DOT[t.status] || "bg-muted-dim"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] text-text truncate">{t.nama_talent}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10.5px] text-muted-dim">{t.platform || "-"}</span>
                  <span className="text-[10.5px] text-muted">·</span>
                  <span className="text-[10.5px] text-muted">{t.status || "-"}</span>
                </div>
              </div>
              <span className={`font-mono text-[11.5px] font-bold flex-shrink-0 px-2.5 py-1 rounded-full ${deadlineColor}`}>
                {deadlineLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}