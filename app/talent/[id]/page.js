import { supabase } from "../../lib/supabase";

export default async function TalentSharePage({ params }) {
  const { id } = await params;

  const { data: talent, error } = await supabase
    .from("talent_share_view")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !talent) {
    return (
      <div className="max-w-[480px] mx-auto px-6 pt-16 text-center">
        <h1 className="font-display text-lg font-semibold text-text">Data tidak ditemukan</h1>
        <p className="text-[13px] text-muted mt-2">Link ini mungkin salah atau sudah tidak berlaku.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto px-6 pt-16 pb-16">
      <div className="text-center mb-8">
        <div className="relative w-8 h-8 rounded-full border-[1.5px] border-ember mx-auto mb-3 after:content-[''] after:absolute after:inset-2 after:rounded-full after:bg-ember" />
        <div className="font-mono text-[11px] text-muted-dim">VOOPOO Indonesia</div>
      </div>

      <div className="bg-panel border border-line-soft rounded-[10px] p-5">
        <div className="font-display text-lg font-semibold text-text mb-1">{talent.nama_talent}</div>
        <div className="text-[13px] text-muted mb-5">{talent.platform}</div>

        <div className="flex items-center justify-between py-3 border-t border-line-soft">
          <span className="text-[12.5px] text-muted">Status</span>
          <span className="font-mono text-[12.5px] text-text">{talent.status || "-"}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-line-soft">
          <span className="text-[12.5px] text-muted">Deadline</span>
          <span className="font-mono text-[12.5px] text-ember">
            {talent.deadline
              ? new Date(talent.deadline + "T00:00:00").toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "-"}
          </span>
        </div>
        {talent.content_judul && (
          <div className="flex items-center justify-between py-3 border-t border-line-soft">
            <span className="text-[12.5px] text-muted">Konten terkait</span>
            <span className="text-[12.5px] text-text text-right">{talent.content_judul}</span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-line-soft">
          <div className="text-[11.5px] text-muted-dim mb-1.5">Brief</div>
          <div className="text-[13.5px] text-text leading-relaxed whitespace-pre-wrap">
            {talent.brief || "Belum ada brief."}
          </div>
        </div>
      </div>
    </div>
  );
}